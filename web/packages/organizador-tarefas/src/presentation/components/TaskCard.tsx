import { Task } from '../../domain/entities/Task';
import './KanbanBoard.css';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export function TaskCard({ task, onDelete, onEdit, onDragStart }: TaskCardProps) {
  const priorityClass = `task-card--priority-${task.priority}`;

  return (
    <div
      className={`task-card ${priorityClass}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
    >
      <div className="task-card__header">
        <h4 className="task-card__title">{task.title}</h4>
        <div className="task-card__actions">
          <button
            className="task-card__action-btn"
            onClick={() => onEdit(task)}
            aria-label="Editar tarefa"
            title="Editar"
          >
            ✏️
          </button>
          <button
            className="task-card__action-btn"
            onClick={() => onDelete(task.id)}
            aria-label="Excluir tarefa"
            title="Excluir"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__footer">
        <div className="task-card__tags">
          {task.tags.map((tag, index) => (
            <span key={index} className="task-card__tag">
              {tag}
            </span>
          ))}
        </div>

        {task.estimatedTime && (
          <div className="task-card__time">
            <span>⏱️</span>
            <span>{task.estimatedTime}min</span>
          </div>
        )}
      </div>
    </div>
  );
}
