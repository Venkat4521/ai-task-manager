import { User, Task, InsertUser, InsertTask } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getTask(id: number): Promise<Task | undefined>;
  getTasksByUserId(userId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task>;
  sessionStore: session.Store;
}

export class MongoStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: string) {
    return User.findById(id);
  }

  async getUserByUsername(username: string) {
    return User.findOne({ username });
  }

  async createUser(userData: InsertUser) {
    const user = new User(userData);
    return user.save();
  }

  async getTask(id: string) {
    return Task.findById(id);
  }

  async getTasksByUserId(userId: string) {
    return Task.find({ userId });
  }

  async createTask(taskData: InsertTask) {
    const task = new Task(taskData);
    return task.save();
  }

  async updateTask(id: string, updates: Partial<Task>) {
    return Task.findByIdAndUpdate(id, updates, { new: true });
  }
}

export const storage = new MongoStorage();
