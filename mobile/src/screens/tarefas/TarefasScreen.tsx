import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, TextInput,
  StyleSheet, Alert, Vibration, AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { FirestoreTaskRepository } from '../../infrastructure/repositories/FirestoreTaskRepository';
import { CreateTaskUseCase, GetTasksUseCase, UpdateTaskUseCase, DeleteTaskUseCase } from '../../application/useCases/TaskUseCases';
import { Task, TaskStatus, TaskPriority } from '../../domain/entities/Task';

// ── Repositório e Use Cases ──────────────────────────────────────
const repo = new FirestoreTaskRepository(db);
const createTask = new CreateTaskUseCase(repo);
const getTasks = new GetTasksUseCase(repo);
const updateTask = new UpdateTaskUseCase(repo);
const deleteTask = new DeleteTaskUseCase(repo);

// ── Tipos Pomodoro ───────────────────────────────────────────────
type TimerMode = 'work' | 'break' | 'long-break';

const TIMER_DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  break: 5 * 60,
  'long-break': 15 * 60,
};

// ── Componente Principal ─────────────────────────────────────────
export function TarefasScreen() {
  const { colors, fontSizeValue: s, spacingValue } = useTheme();
  const { cognitiveAlerts } = useAccessibility();
  const { user } = useAuth();

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<TaskStatus>('todo');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskEstimated, setTaskEstimated] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Pomodoro
  const [timerMode, setTimerMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0); // segundos
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const focusAccRef = useRef(0); // acumulador de foco contínuo em segundos

  // ── Load Tasks ──────────────────────────────────────────────────
  const loadTasks = useCallback(async () => {
    if (!user) return;
    const list = await getTasks.execute(user.id);
    setTasks(list);
  }, [user]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // ── Pomodoro Timer ──────────────────────────────────────────────
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            handleTimerEnd();
            return 0;
          }
          if (timerMode === 'work') {
            focusAccRef.current += 1;
            setTotalFocusTime((prev) => prev + 1);
            // Alerta cognitivo após 90 min contínuos
            if (cognitiveAlerts && focusAccRef.current === 90 * 60) {
              Vibration.vibrate([0, 500, 200, 500]);
              Alert.alert(
                '⏰ Alerta Cognitivo',
                'Você está em foco há 90 minutos. Considere fazer uma pausa mais longa para descansar.',
                [{ text: 'Entendido', onPress: () => {} }],
              );
            }
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timerMode, cognitiveAlerts]);

  const handleTimerEnd = () => {
    Vibration.vibrate([0, 300, 100, 300]);
    if (timerMode === 'work') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      focusAccRef.current = 0;
      if (newSessions % 4 === 0) {
        setTimerMode('long-break');
        setTimeLeft(TIMER_DURATIONS['long-break']);
        Alert.alert('🎉 Ciclo completo!', 'Você completou 4 sessões! Hora de uma pausa longa (15 min).');
      } else {
        setTimerMode('break');
        setTimeLeft(TIMER_DURATIONS.break);
        Alert.alert('✅ Sessão concluída!', 'Hora de uma pausa curta (5 min).');
      }
    } else {
      setTimerMode('work');
      setTimeLeft(TIMER_DURATIONS.work);
      Alert.alert('🚀 Pausa encerrada!', 'Pronto para mais uma sessão de foco?');
    }
  };

  const toggleTimer = () => setIsRunning((r) => !r);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[timerMode]);
    focusAccRef.current = 0;
  };

  const switchMode = (mode: TimerMode) => {
    setIsRunning(false);
    setTimerMode(mode);
    setTimeLeft(TIMER_DURATIONS[mode]);
    focusAccRef.current = 0;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s2 = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s2}`;
  };

  const progress = 1 - timeLeft / TIMER_DURATIONS[timerMode];

  // ── Tasks CRUD ──────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingTask(null);
    setTaskTitle(''); setTaskDesc(''); setTaskPriority('medium');
    setTaskEstimated(''); setTags([]); setTagInput('');
    setModalVisible(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description || '');
    setTaskPriority(task.priority);
    setTaskEstimated(task.estimatedTime?.toString() || '');
    setTags(task.tags);
    setTagInput('');
    setModalVisible(true);
  };

  const handleSaveTask = async () => {
    if (!taskTitle.trim() || !user) return;
    try {
      if (editingTask) {
        const updated = await updateTask.execute(editingTask.id, {
          title: taskTitle.trim(),
          description: taskDesc.trim() || '',
          priority: taskPriority,
          estimatedTime: taskEstimated ? parseInt(taskEstimated) : 0,
          tags,
        });
        setTasks((prev) => prev.map((t) => t.id === updated.id ? updated : t));
      } else {
        const created = await createTask.execute({
          userId: user.id,
          title: taskTitle.trim(),
          description: taskDesc.trim() || '',
          status: activeColumn,
          priority: taskPriority,
          estimatedTime: taskEstimated ? parseInt(taskEstimated) : 0,
          tags,
        });
        setTasks((prev) => [created, ...prev]);
      }
      setModalVisible(false);
    } catch (err) {
      console.error('Erro ao salvar tarefa:', err);
      Alert.alert('Erro', 'Nao foi possivel salvar a tarefa. Verifique sua conexao.');
    }
  };

  const handleMoveTask = async (task: Task, newStatus: TaskStatus) => {
    const updated = await updateTask.execute(task.id, {
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
    });
    setTasks((prev) => prev.map((t) => t.id === updated.id ? updated : t));
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert('Excluir tarefa', `Excluir "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          await deleteTask.execute(task.id);
          setTasks((prev) => prev.filter((t) => t.id !== task.id));
        },
      },
    ]);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  // ── Filtro por coluna ────────────────────────────────────────────
  const columnTasks = tasks.filter((t) => t.status === activeColumn);
  const COLUMNS: { key: TaskStatus; label: string; icon: string }[] = [
    { key: 'todo', label: 'A Fazer', icon: '📋' },
    { key: 'in-progress', label: 'Em Progresso', icon: '⚡' },
    { key: 'done', label: 'Concluído', icon: '✅' },
  ];
  const NEXT_STATUS: Record<TaskStatus, TaskStatus | null> = {
    todo: 'in-progress',
    'in-progress': 'done',
    done: null,
  };
  const PREV_STATUS: Record<TaskStatus, TaskStatus | null> = {
    todo: null,
    'in-progress': 'todo',
    done: 'in-progress',
  };

  const PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Baixa', color: '#10B981' },
    { value: 'medium', label: 'Média', color: '#F59E0B' },
    { value: 'high', label: 'Alta', color: '#EF4444' },
  ];

  const timerLabels: Record<TimerMode, string> = {
    work: '🎯 Foco',
    break: '☕ Pausa Curta',
    'long-break': '🛌 Pausa Longa',
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Pomodoro Timer ── */}
        <View style={[styles.card, { backgroundColor: colors.card, marginHorizontal: 16 }]}>
          {/* Seletor de modo */}
          <View style={styles.modeRow}>
            {(['work', 'break', 'long-break'] as TimerMode[]).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.modeBtn, { backgroundColor: timerMode === m ? colors.primary : colors.border + '50' }]}
                onPress={() => switchMode(m)}
                accessibilityRole="radio"
                accessibilityState={{ selected: timerMode === m }}
              >
                <Text style={[styles.modeBtnText, { color: timerMode === m ? '#FFF' : colors.textSecondary, fontSize: s - 4 }]}>
                  {timerLabels[m]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Círculo de progresso (simplificado) */}
          <View style={styles.timerCenter}>
            <View style={[styles.timerCircle, { borderColor: colors.primary }]}>
              <Text style={[styles.timerText, { color: colors.primary }]}>{formatTime(timeLeft)}</Text>
              <Text style={[styles.timerLabel, { color: colors.textSecondary, fontSize: s - 2 }]}>
                {timerLabels[timerMode]}
              </Text>
            </View>
          </View>

          {/* Controles */}
          <View style={styles.timerControls}>
            <TouchableOpacity
              style={[styles.timerBtn, styles.timerBtnSecondary, { borderColor: colors.border }]}
              onPress={resetTimer}
              accessibilityRole="button" accessibilityLabel="Reiniciar timer"
            >
              <Text style={[styles.timerBtnText, { color: colors.textSecondary }]}>↺ Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timerBtn, { backgroundColor: isRunning ? colors.warning : colors.primary }]}
              onPress={toggleTimer}
              accessibilityRole="button"
              accessibilityLabel={isRunning ? 'Pausar timer' : 'Iniciar timer'}
            >
              <Text style={styles.timerBtnTextPrimary}>{isRunning ? '⏸ Pausar' : '▶ Iniciar'}</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{sessions}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: s - 3 }]}>Sessões</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{Math.floor(totalFocusTime / 60)}m</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: s - 3 }]}>Foco total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{sessions % 4}/4</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: s - 3 }]}>Ciclo atual</Text>
            </View>
          </View>
        </View>

        {/* ── Kanban ── */}
        <View style={styles.kanbanHeader}>
          <Text style={[styles.kanbanTitle, { color: colors.text, fontSize: s + 2 }]}>📋 Tarefas</Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={openCreateModal}
            accessibilityRole="button" accessibilityLabel="Adicionar tarefa"
          >
            <Text style={styles.addBtnText}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Abas de colunas */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabs}>
          {COLUMNS.map((col) => {
            const count = tasks.filter((t) => t.status === col.key).length;
            const active = activeColumn === col.key;
            return (
              <TouchableOpacity
                key={col.key}
                style={[styles.tab, { backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border }]}
                onPress={() => setActiveColumn(col.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.tabText, { color: active ? '#FFF' : colors.text, fontSize: s - 1 }]}>
                  {col.icon} {col.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Lista de tarefas */}
        <View style={styles.taskList}>
          {columnTasks.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: s }]}>Nenhuma tarefa aqui</Text>
              <Text style={[styles.emptySubText, { color: colors.textSecondary, fontSize: s - 2 }]}>
                Toque em "Adicionar" para criar uma nova tarefa
              </Text>
            </View>
          ) : (
            columnTasks.map((task) => {
              const priority = PRIORITIES.find((p) => p.value === task.priority)!;
              const next = NEXT_STATUS[task.status];
              const prev = PREV_STATUS[task.status];
              return (
                <TouchableOpacity
                  key={task.id}
                  style={[styles.taskCard, { backgroundColor: colors.card, borderLeftColor: priority.color }]}
                  onLongPress={() => openEditModal(task)}
                  accessibilityRole="button"
                  accessibilityLabel={`Tarefa: ${task.title}`}
                  accessibilityHint="Toque longo para editar"
                >
                  <View style={styles.taskHeader}>
                    <View style={[styles.priorityBadge, { backgroundColor: priority.color + '20' }]}>
                      <Text style={[styles.priorityText, { color: priority.color, fontSize: s - 3 }]}>
                        {priority.label}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteTask(task)}
                      accessibilityRole="button" accessibilityLabel="Excluir tarefa"
                    >
                      <Text style={{ color: colors.error, fontSize: 18 }}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.taskTitle, { color: colors.text, fontSize: s }]}>{task.title}</Text>
                  {!!task.description && (
                    <Text style={[styles.taskDesc, { color: colors.textSecondary, fontSize: s - 2 }]} numberOfLines={2}>
                      {task.description}
                    </Text>
                  )}
                  {task.tags.length > 0 && (
                    <View style={styles.tagsRow}>
                      {task.tags.map((tag) => (
                        <View key={tag} style={[styles.tag, { backgroundColor: colors.primary + '18' }]}>
                          <Text style={[styles.tagText, { color: colors.primary, fontSize: s - 4 }]}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <View style={styles.taskActions}>
                    {prev && (
                      <TouchableOpacity
                        style={[styles.moveBtn, { borderColor: colors.border }]}
                        onPress={() => handleMoveTask(task, prev)}
                        accessibilityRole="button"
                      >
                        <Text style={[styles.moveBtnText, { color: colors.textSecondary, fontSize: s - 2 }]}>← Voltar</Text>
                      </TouchableOpacity>
                    )}
                    {next && (
                      <TouchableOpacity
                        style={[styles.moveBtn, { borderColor: colors.primary, backgroundColor: colors.primary + '12' }]}
                        onPress={() => handleMoveTask(task, next)}
                        accessibilityRole="button"
                      >
                        <Text style={[styles.moveBtnText, { color: colors.primary, fontSize: s - 2 }]}>
                          {next === 'in-progress' ? 'Iniciar →' : 'Concluir ✓'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Modal de tarefa ── */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={[styles.modalSafe, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)} accessibilityRole="button" accessibilityLabel="Fechar">
              <Text style={[styles.modalClose, { color: colors.textSecondary }]}>✕ Fechar</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text, fontSize: s + 2 }]}>
              {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </Text>
            <TouchableOpacity
              onPress={handleSaveTask}
              disabled={!taskTitle.trim()}
              accessibilityRole="button"
              accessibilityLabel={editingTask ? 'Salvar alterações' : 'Criar tarefa'}
            >
              <Text style={[styles.modalSave, { color: taskTitle.trim() ? colors.primary : colors.textSecondary }]}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
            <Text style={[styles.fieldLabel, { color: colors.text, fontSize: s }]}>Título *</Text>
            <TextInput
              style={[styles.textInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface, fontSize: s }]}
              value={taskTitle}
              onChangeText={setTaskTitle}
              placeholder="Nome da tarefa"
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Título da tarefa"
            />

            <Text style={[styles.fieldLabel, { color: colors.text, fontSize: s }]}>Descrição</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface, fontSize: s }]}
              value={taskDesc}
              onChangeText={setTaskDesc}
              placeholder="Descreva a tarefa..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              accessibilityLabel="Descrição da tarefa"
            />

            <Text style={[styles.fieldLabel, { color: colors.text, fontSize: s }]}>Prioridade</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[styles.priorityBtn, { borderColor: taskPriority === p.value ? p.color : colors.border, backgroundColor: taskPriority === p.value ? p.color + '20' : colors.surface }]}
                  onPress={() => setTaskPriority(p.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: taskPriority === p.value }}
                >
                  <Text style={[styles.priorityBtnText, { color: taskPriority === p.value ? p.color : colors.textSecondary, fontSize: s - 1 }]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: colors.text, fontSize: s }]}>Tempo estimado (min)</Text>
            <TextInput
              style={[styles.textInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface, fontSize: s }]}
              value={taskEstimated}
              onChangeText={setTaskEstimated}
              placeholder="Ex: 30"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              accessibilityLabel="Tempo estimado em minutos"
            />

            <Text style={[styles.fieldLabel, { color: colors.text, fontSize: s }]}>Tags</Text>
            <View style={styles.tagInputRow}>
              <TextInput
                style={[styles.textInput, styles.tagInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface, fontSize: s }]}
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="Adicionar tag..."
                placeholderTextColor={colors.textSecondary}
                onSubmitEditing={addTag}
                returnKeyType="done"
                accessibilityLabel="Adicionar tag"
              />
              <TouchableOpacity style={[styles.tagAddBtn, { backgroundColor: colors.primary }]} onPress={addTag} accessibilityRole="button">
                <Text style={styles.tagAddBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            {tags.length > 0 && (
              <View style={styles.tagsRow}>
                {tags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tag, { backgroundColor: colors.primary + '20' }]}
                    onPress={() => setTags(tags.filter((t) => t !== tag))}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover tag ${tag}`}
                  >
                    <Text style={[styles.tagText, { color: colors.primary, fontSize: s - 3 }]}>#{tag} ✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingTop: 12 },
  card: {
    borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  modeBtn: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  modeBtnText: { fontWeight: '600' },
  timerCenter: { alignItems: 'center', marginBottom: 16 },
  timerCircle: {
    width: 160, height: 160, borderRadius: 80, borderWidth: 6,
    justifyContent: 'center', alignItems: 'center',
  },
  timerText: { fontSize: 40, fontWeight: '800' },
  timerLabel: { marginTop: 4, fontWeight: '500' },
  timerControls: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  timerBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  timerBtnSecondary: { borderWidth: 1.5 },
  timerBtnText: { fontSize: 15, fontWeight: '600' },
  timerBtnTextPrimary: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontWeight: '500', marginTop: 2 },
  kanbanHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  kanbanTitle: { fontWeight: '700' },
  addBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  tabsScroll: { marginBottom: 12 },
  tabs: { paddingHorizontal: 16, gap: 8 },
  tab: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5 },
  tabText: { fontWeight: '600' },
  taskList: { paddingHorizontal: 16, gap: 10 },
  emptyState: { borderRadius: 16, padding: 32, alignItems: 'center' },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontWeight: '600', marginBottom: 4 },
  emptySubText: { textAlign: 'center', lineHeight: 20 },
  taskCard: {
    borderRadius: 16, padding: 14, borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  priorityBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  priorityText: { fontWeight: '700' },
  taskTitle: { fontWeight: '700', marginBottom: 4 },
  taskDesc: { lineHeight: 20, marginBottom: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontWeight: '600' },
  taskActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  moveBtn: { flex: 1, borderRadius: 8, borderWidth: 1.5, paddingVertical: 6, alignItems: 'center' },
  moveBtnText: { fontWeight: '600' },
  // Modal
  modalSafe: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  modalClose: { fontSize: 15, fontWeight: '600' },
  modalTitle: { fontWeight: '700' },
  modalSave: { fontSize: 15, fontWeight: '700' },
  modalBody: { padding: 16, paddingBottom: 40 },
  fieldLabel: { fontWeight: '600', marginBottom: 6, marginTop: 16 },
  textInput: {
    borderWidth: 1.5, borderRadius: 12, padding: 12,
    fontSize: 16,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityBtn: { flex: 1, borderRadius: 10, borderWidth: 1.5, paddingVertical: 10, alignItems: 'center' },
  priorityBtnText: { fontWeight: '700' },
  tagInputRow: { flexDirection: 'row', gap: 8 },
  tagInput: { flex: 1 },
  tagAddBtn: { borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  tagAddBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', lineHeight: 24 },
});
