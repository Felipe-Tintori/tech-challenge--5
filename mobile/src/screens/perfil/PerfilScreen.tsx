import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { FirestoreUserProfileRepository } from '../../infrastructure/repositories/FirestoreUserProfileRepository';
import { GetUserProfileUseCase, UpdateUserProfileUseCase } from '../../application/useCases/ProfileUseCases';
import { Neurodivergence, UserProfile } from '../../domain/entities/UserProfile';

const repo = new FirestoreUserProfileRepository(db);
const getProfile = new GetUserProfileUseCase(repo);
const updateProfile = new UpdateUserProfileUseCase(repo);

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const NEURODIVERGENCES: { value: Neurodivergence; label: string; icon: string }[] = [
  { value: 'tdah', label: 'TDAH', icon: '⚡' },
  { value: 'tea', label: 'TEA (Autismo)', icon: '🧩' },
  { value: 'dislexia', label: 'Dislexia', icon: '📖' },
  { value: 'ansiedade', label: 'Ansiedade', icon: '💫' },
  { value: 'outro', label: 'Outro', icon: '🔷' },
];

export function PerfilScreen() {
  const { colors, fontSizeValue: s } = useTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [neurodivergence, setNeurodivergence] = useState<Neurodivergence[]>([]);
  const [specificNeeds, setSpecificNeeds] = useState<string[]>([]);
  const [needInput, setNeedInput] = useState('');
  const [studyDays, setStudyDays] = useState<number[]>([]);
  const [studyStart, setStudyStart] = useState('08:00');
  const [studyEnd, setStudyEnd] = useState('17:00');

  useEffect(() => {
    if (!user) return;
    getProfile.execute(user.id).then((profile) => {
      if (profile) {
        setName(profile.name || '');
        setBio(profile.bio || '');
        setNeurodivergence(profile.neurodivergence || []);
        setSpecificNeeds(profile.specificNeeds || []);
        if (profile.studyRoutine) {
          setStudyDays(profile.studyRoutine.daysOfWeek || []);
          setStudyStart(profile.studyRoutine.startTime || '08:00');
          setStudyEnd(profile.studyRoutine.endTime || '17:00');
        }
      } else {
        setName(user.name || '');
      }
    }).finally(() => setLoading(false));
  }, [user]);

  const toggleNeurodivergence = (v: Neurodivergence) => {
    setNeurodivergence((prev) =>
      prev.includes(v) ? prev.filter((n) => n !== v) : [...prev, v]
    );
  };

  const toggleStudyDay = (day: number) => {
    setStudyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const addNeed = () => {
    const t = needInput.trim();
    if (t && !specificNeeds.includes(t)) setSpecificNeeds([...specificNeeds, t]);
    setNeedInput('');
  };

  const handleSave = async () => {
    if (!user || !name.trim()) {
      Alert.alert('Atenção', 'O nome é obrigatório.');
      return;
    }
    setSaving(true);
    try {
      const profileData: Record<string, unknown> = {
        name: name.trim(),
        email: user.email,
        bio: bio.trim() || '',
        neurodivergence,
        specificNeeds,
        updatedAt: new Date().toISOString(),
      };
      if (studyDays.length > 0) {
        profileData.studyRoutine = { daysOfWeek: studyDays, startTime: studyStart, endTime: studyEnd, breakInterval: 25 };
      }
      await updateProfile.execute(user.id, profileData as any);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      Alert.alert('Erro', 'Não foi possível salvar o perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={[styles.avatarSection, { backgroundColor: colors.primary }]}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primaryDark }]}>
            <Text style={styles.avatarText}>
              {name ? name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <Text style={styles.avatarName}>{name || 'Usuário'}</Text>
          <Text style={styles.avatarEmail}>{user?.email}</Text>
        </View>

        {/* Sucesso */}
        {success && (
          <View style={[styles.successBox, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.successText, { fontSize: s - 1 }]}>✅ Perfil salvo com sucesso!</Text>
          </View>
        )}

        {/* ── Informações Pessoais ── */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontSize: s + 1 }]}>👤 Informações Pessoais</Text>

          <Text style={[styles.label, { color: colors.text, fontSize: s }]}>Nome completo *</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface, fontSize: s }]}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
            accessibilityLabel="Nome completo"
          />

          <Text style={[styles.label, { color: colors.text, fontSize: s }]}>Bio (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface, fontSize: s }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Conte um pouco sobre você..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
            accessibilityLabel="Bio"
          />
        </View>

        {/* ── Neurodivergências ── */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontSize: s + 1 }]}>🧩 Características</Text>
          <Text style={[styles.cardDesc, { color: colors.textSecondary, fontSize: s - 2 }]}>
            Selecione as que se aplicam a você. Isso nos ajuda a personalizar melhor sua experiência.
          </Text>
          <View style={styles.checkboxList}>
            {NEURODIVERGENCES.map((item) => {
              const checked = neurodivergence.includes(item.value);
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.checkbox, { borderColor: checked ? colors.primary : colors.border, backgroundColor: checked ? colors.primary + '15' : colors.surface }]}
                  onPress={() => toggleNeurodivergence(item.value)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  accessibilityLabel={item.label}
                >
                  <Text style={styles.checkboxIcon}>{item.icon}</Text>
                  <Text style={[styles.checkboxLabel, { color: checked ? colors.primary : colors.text, fontSize: s - 1 }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.checkboxCheck, { color: checked ? colors.primary : 'transparent' }]}>✓</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Necessidades Específicas ── */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontSize: s + 1 }]}>💬 Necessidades Específicas</Text>
          <Text style={[styles.cardDesc, { color: colors.textSecondary, fontSize: s - 2 }]}>
            Adicione necessidades que a plataforma deve considerar.
          </Text>
          <View style={styles.tagInputRow}>
            <TextInput
              style={[styles.input, styles.tagInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface, fontSize: s }]}
              value={needInput}
              onChangeText={setNeedInput}
              placeholder="Ex: prefiro textos curtos"
              placeholderTextColor={colors.textSecondary}
              onSubmitEditing={addNeed}
              returnKeyType="done"
              accessibilityLabel="Adicionar necessidade específica"
            />
            <TouchableOpacity
              style={[styles.addNeedBtn, { backgroundColor: colors.primary }]}
              onPress={addNeed}
              accessibilityRole="button"
            >
              <Text style={styles.addNeedBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          {specificNeeds.length > 0 && (
            <View style={styles.tagsContainer}>
              {specificNeeds.map((need) => (
                <TouchableOpacity
                  key={need}
                  style={[styles.tag, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '40' }]}
                  onPress={() => setSpecificNeeds(specificNeeds.filter((n) => n !== need))}
                  accessibilityRole="button"
                  accessibilityLabel={`Remover ${need}`}
                >
                  <Text style={[styles.tagText, { color: colors.primary, fontSize: s - 2 }]}>{need} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ── Rotina de Estudos ── */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontSize: s + 1 }]}>📚 Rotina de Estudos</Text>

          <Text style={[styles.label, { color: colors.text, fontSize: s }]}>Dias da semana</Text>
          <View style={styles.daysRow}>
            {DAYS.map((day, idx) => {
              const active = studyDays.includes(idx);
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayBtn, { backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border }]}
                  onPress={() => toggleStudyDay(idx)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: active }}
                  accessibilityLabel={day}
                >
                  <Text style={[styles.dayText, { color: active ? '#FFF' : colors.textSecondary, fontSize: s - 2 }]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Text style={[styles.label, { color: colors.text, fontSize: s }]}>Início</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface, fontSize: s, textAlign: 'center' }]}
                value={studyStart}
                onChangeText={setStudyStart}
                placeholder="08:00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numbers-and-punctuation"
                accessibilityLabel="Horário de início"
              />
            </View>
            <View style={styles.timeSeparator}>
              <Text style={[{ color: colors.textSecondary, fontSize: s + 4, fontWeight: '300' }]}>→</Text>
            </View>
            <View style={styles.timeField}>
              <Text style={[styles.label, { color: colors.text, fontSize: s }]}>Fim</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface, fontSize: s, textAlign: 'center' }]}
                value={studyEnd}
                onChangeText={setStudyEnd}
                placeholder="17:00"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numbers-and-punctuation"
                accessibilityLabel="Horário de fim"
              />
            </View>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: saving ? colors.border : colors.primary }]}
          onPress={handleSave}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Salvar perfil"
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>💾 Salvar Perfil</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { paddingBottom: 32 },
  avatarSection: { padding: 32, alignItems: 'center', marginBottom: 16 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  avatarName: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  avatarEmail: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  successBox: {
    marginHorizontal: 16, marginBottom: 12, borderRadius: 12,
    padding: 12, alignItems: 'center',
  },
  successText: { fontWeight: '600', color: '#065F46' },
  card: {
    marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: { fontWeight: '700', marginBottom: 12 },
  cardDesc: { lineHeight: 20, marginBottom: 12 },
  label: { fontWeight: '600', marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  checkboxList: { gap: 8 },
  checkbox: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    borderWidth: 1.5, padding: 12, gap: 10,
  },
  checkboxIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  checkboxLabel: { flex: 1, fontWeight: '600' },
  checkboxCheck: { fontSize: 18, fontWeight: '700' },
  tagInputRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tagInput: { flex: 1 },
  addNeedBtn: { borderRadius: 12, paddingHorizontal: 18, justifyContent: 'center', alignItems: 'center' },
  addNeedBtnText: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', lineHeight: 28 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  tagText: { fontWeight: '600' },
  daysRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 12 },
  dayBtn: { borderRadius: 10, borderWidth: 1.5, paddingHorizontal: 10, paddingVertical: 8, minWidth: 40, alignItems: 'center' },
  dayText: { fontWeight: '700' },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  timeField: { flex: 1 },
  timeSeparator: { paddingBottom: 10 },
  saveBtn: {
    marginHorizontal: 16, marginTop: 8, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
