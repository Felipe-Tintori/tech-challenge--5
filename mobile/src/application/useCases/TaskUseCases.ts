import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../../domain/entities/Task';

export class CreateTaskUseCase {
  constructor(private repo: ITaskRepository) {}
  execute(data: CreateTaskDTO): Promise<Task> { return this.repo.createTask(data); }
}

export class GetTasksUseCase {
  constructor(private repo: ITaskRepository) {}
  execute(userId: string): Promise<Task[]> { return this.repo.getTasks(userId); }
}

export class UpdateTaskUseCase {
  constructor(private repo: ITaskRepository) {}
  execute(id: string, data: UpdateTaskDTO): Promise<Task> { return this.repo.updateTask(id, data); }
}

export class DeleteTaskUseCase {
  constructor(private repo: ITaskRepository) {}
  execute(id: string): Promise<void> { return this.repo.deleteTask(id); }
}
