import { Task, CreateTaskDTO, UpdateTaskDTO } from '../entities/Task';

export interface ITaskRepository {
  getTasks(userId: string): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(data: CreateTaskDTO): Promise<Task>;
  updateTask(id: string, data: UpdateTaskDTO): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}
