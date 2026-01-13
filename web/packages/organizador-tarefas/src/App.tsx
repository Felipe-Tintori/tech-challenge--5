import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Task, TaskStatus } from './domain/entities/Task';
import { KanbanBoard } from './presentation/components/KanbanBoard';
import { TaskModal } from './presentation/components/TaskModal';
import { PomodoroTimer } from './presentation/components/PomodoroTimer';
import './styles/app.css';

function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus>('todo');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddTask = (status: TaskStatus) => {
    setEditingTask(undefined);
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handleSaveTask = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="organizador-tarefas">
      <header className="organizador-tarefas__header">
        <h1>✓ Organizador de Tarefas</h1>
        <p>Gerencie suas atividades com Kanban e Timer Pomodoro</p>
      </header>

      <div className="organizador-tarefas__content">
        <PomodoroTimer />
        <KanbanBoard
          key={refreshKey}
          onEditTask={handleEditTask}
          onAddTask={handleAddTask}
        />
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          initialStatus={modalInitialStatus}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TasksPage />} />
    </Routes>
  );
}
