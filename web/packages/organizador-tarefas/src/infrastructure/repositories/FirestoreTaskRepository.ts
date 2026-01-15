import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../../domain/entities/Task';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { getFirestoreDb } from '../config/firebase';
import { getAuth } from 'firebase/auth';

const COLLECTION_NAME = 'tasks';

export class FirestoreTaskRepository implements ITaskRepository {
  private db = getFirestoreDb();

  private getUserId(): string {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    return userId;
  }

  async getTasks(): Promise<Task[]> {
    try {
      const userId = this.getUserId();
      const q = query(
        collection(this.db, COLLECTION_NAME),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return tasks.map(task => this.convertToTask(task));
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const docRef = doc(this.db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return this.convertToTask({ id: docSnap.id, ...docSnap.data() });
      }
      return null;
    } catch (error) {
      console.error('Error getting task by id:', error);
      return null;
    }
  }

  async createTask(data: CreateTaskDTO): Promise<Task> {
    const taskId = crypto.randomUUID();
    const userId = this.getUserId();
    const newTask: Task = {
      id: taskId,
      title: data.title,
      description: data.description,
      status: 'todo',
      priority: data.priority,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedTime: data.estimatedTime,
      tags: data.tags || [],
    };
    
    try {
      const docRef = doc(this.db, COLLECTION_NAME, taskId);
      const taskData = this.removeUndefined({ ...newTask, userId });
      await setDoc(docRef, taskData);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    try {
      const userId = this.getUserId();
      const existingTask = await this.getTaskById(id);
      
      if (!existingTask) {
        throw new Error('Task not found');
      }

      const updatedTask: Task = {
        ...existingTask,
        ...data,
        updatedAt: new Date(),
        completedAt: data.status === 'done' ? new Date() : existingTask.completedAt,
      };

      const docRef = doc(this.db, COLLECTION_NAME, id);
      const taskData = this.removeUndefined({ ...updatedTask, userId });
      await setDoc(docRef, taskData);
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const docRef = doc(this.db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  private removeUndefined(obj: any): any {
    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined) {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  }

  private convertToTask(data: any): Task {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
      completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : (data.completedAt ? new Date(data.completedAt) : undefined),
      estimatedTime: data.estimatedTime,
      tags: data.tags || [],
    };
  }
}
