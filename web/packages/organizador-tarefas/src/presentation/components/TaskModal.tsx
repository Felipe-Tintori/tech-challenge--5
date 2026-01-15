import { useState } from 'react';
import { Task, TaskPriority, TaskStatus, CreateTaskDTO } from '../../domain/entities/Task';
import { FirestoreTaskRepository } from '../../infrastructure/repositories/FirestoreTaskRepository';
import { CreateTaskUseCase } from '../../application/useCases/CreateTaskUseCase';
import { UpdateTaskUseCase } from '../../application/useCases/UpdateTaskUseCase';
import './TaskModal.css';

const repository = new FirestoreTaskRepository();
const createTaskUseCase = new CreateTaskUseCase(repository);
const updateTaskUseCase = new UpdateTaskUseCase(repository);

interface TaskModalProps {
  task?: Task;
  initialStatus?: TaskStatus;
  onClose: () => void;
  onSave: () => void;
}

export function TaskModal({ task, initialStatus, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [estimatedTime, setEstimatedTime] = useState(task?.estimatedTime?.toString() || '');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const taskData: CreateTaskDTO = {
      title: title.trim(),
      description: description.trim(),
      priority,
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
      tags,
    };

    if (task) {
      await updateTaskUseCase.execute(task.id, taskData);
    } else {
      await createTaskUseCase.execute(taskData);
      if (initialStatus && initialStatus !== 'todo') {
        // Se foi criado em outra coluna, atualizar o status
        const createdTasks = await repository.getTasks();
        const lastTask = createdTasks[createdTasks.length - 1];
        await updateTaskUseCase.execute(lastTask.id, { status: initialStatus });
      }
    }

    onSave();
    onClose();
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="task-modal" onClick={handleBackdropClick}>
      <div className="task-modal__content">
        <div className="task-modal__header">
          <h2 className="task-modal__title">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            className="task-modal__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Título *</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Descrição</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes da tarefa"
            />
          </div>

          <div className="form-group form-group--inline">
            <label htmlFor="task-priority">Prioridade</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div className="form-group form-group--inline">
            <label htmlFor="task-time">Tempo Estimado</label>
            <input
              id="task-time"
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="Minutos"
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-tags">Tags</label>
            <div className="tags-input">
              {tags.map((tag, index) => (
                <span key={index} className="tag-item">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`Remover tag ${tag}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                id="task-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Digite e pressione Enter"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Salvar' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
