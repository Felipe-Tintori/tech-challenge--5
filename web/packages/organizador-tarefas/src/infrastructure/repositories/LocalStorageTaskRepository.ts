import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../../domain/entities/Task';

const STORAGE_KEY = 'mindease_tasks';

export class LocalStorageTaskRepository implements ITaskRepository {
  private loadTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const tasks = JSON.parse(data);
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }));
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  async getTasks(): Promise<Task[]> {
    return this.loadTasks();
  }

  async getTaskById(id: string): Promise<Task | null> {
    const tasks = this.loadTasks();
    return tasks.find(task => task.id === id) || null;
  }

  async createTask(data: CreateTaskDTO): Promise<Task> {
    const tasks = this.loadTasks();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      status: 'todo',
      priority: data.priority,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: data.estimatedTime,
      tags: data.tags || [],
    };
    
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    const tasks = this.loadTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...data,
      updatedAt: new Date(),
      completedAt: data.status === 'done' ? new Date() : tasks[taskIndex].completedAt,
    };

    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = this.loadTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    this.saveTasks(filteredTasks);
  }
}
