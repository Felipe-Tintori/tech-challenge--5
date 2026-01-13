import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    return this.taskRepository.deleteTask(id);
  }
}
