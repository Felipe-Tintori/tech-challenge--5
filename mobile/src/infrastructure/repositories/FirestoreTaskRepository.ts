import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Firestore,
} from 'firebase/firestore';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../../domain/entities/Task';

export class FirestoreTaskRepository implements ITaskRepository {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  async getTasks(userId: string): Promise<Task[]> {
    const q = query(
      collection(this.db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
  }

  async getTaskById(id: string): Promise<Task | null> {
    const snap = await getDoc(doc(this.db, 'tasks', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Task;
  }

  async createTask(data: CreateTaskDTO): Promise<Task> {
    const now = new Date().toISOString();
    const raw = { ...data, createdAt: now, updatedAt: now };
    // Remove undefined — Firestore rejects them
    const taskData = JSON.parse(JSON.stringify(raw));
    const ref = await addDoc(collection(this.db, 'tasks'), taskData);
    return { id: ref.id, ...taskData } as Task;
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    const ref = doc(this.db, 'tasks', id);
    const raw = { ...data, updatedAt: new Date().toISOString() };
    // Remove undefined — Firestore rejects them
    const updated = JSON.parse(JSON.stringify(raw));
    await updateDoc(ref, updated);
    const snap = await getDoc(ref);
    return { id: snap.id, ...snap.data() } as Task;
  }

  async deleteTask(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'tasks', id));
  }
}
