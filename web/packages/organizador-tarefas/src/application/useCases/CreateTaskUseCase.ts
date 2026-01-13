import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, CreateTaskDTO } from '../../domain/entities/Task';

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(data: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(data);
  }
}
