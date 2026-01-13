import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../../domain/entities/Task';
import { LocalStorageTaskRepository } from '../../infrastructure/repositories/LocalStorageTaskRepository';
import { GetTasksUseCase } from '../../application/useCases/GetTasksUseCase';
import { UpdateTaskUseCase } from '../../application/useCases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../application/useCases/DeleteTaskUseCase';
import { TaskCard } from './TaskCard';
import './KanbanBoard.css';

const repository = new LocalStorageTaskRepository();
const getTasksUseCase = new GetTasksUseCase(repository);
const updateTaskUseCase = new UpdateTaskUseCase(repository);
const deleteTaskUseCase = new DeleteTaskUseCase(repository);

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  emoji: string;
  tasks: Task[];
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
}

function KanbanColumn({
  status,
  title,
  emoji,
  tasks,
  onTaskDelete,
  onTaskEdit,
  onDragStart,
  onDragOver,
  onDrop,
  onAddTask,
}: KanbanColumnProps) {
  return (
    <div
      className={`kanban-column kanban-column--${status}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="kanban-column__header">
        <h3 className="kanban-column__title">
          <span>{emoji}</span>
          <span>{title}</span>
        </h3>
        <span className="kanban-column__count">{tasks.length}</span>
      </div>

      <div className="kanban-column__tasks">
        {tasks.length === 0 ? (
          <div className="kanban-empty">Nenhuma tarefa</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onTaskDelete}
              onEdit={onTaskEdit}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>

      <button
        className="add-task-btn"
        onClick={() => onAddTask(status)}
        aria-label={`Adicionar tarefa em ${title}`}
      >
        <span>➕</span>
        <span>Adicionar Tarefa</span>
      </button>
    </div>
  );
}

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function KanbanBoard({ onEditTask, onAddTask }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const allTasks = await getTasksUseCase.execute();
    setTasks(allTasks);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    await updateTaskUseCase.execute(draggedTask.id, { status: newStatus });
    await loadTasks();
    setDraggedTask(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await deleteTaskUseCase.execute(id);
      await loadTasks();
    }
  };

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div className="kanban-board">
      <KanbanColumn
        status="todo"
        title="A Fazer"
        emoji="📋"
        tasks={todoTasks}
        onTaskDelete={handleDelete}
        onTaskEdit={onEditTask}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onAddTask={onAddTask}
      />

      <KanbanColumn
        status="in-progress"
        title="Em Progresso"
        emoji="⚡"
        tasks={inProgressTasks}
        onTaskDelete={handleDelete}
        onTaskEdit={onEditTask}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onAddTask={onAddTask}
      />

      <KanbanColumn
        status="done"
        title="Concluído"
        emoji="✅"
        tasks={doneTasks}
        onTaskDelete={handleDelete}
        onTaskEdit={onEditTask}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onAddTask={onAddTask}
      />
    </div>
  );
}
