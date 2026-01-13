import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, UpdateTaskDTO } from '../../domain/entities/Task';

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, data: UpdateTaskDTO): Promise<Task> {
    return this.taskRepository.updateTask(id, data);
  }
}
