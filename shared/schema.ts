import mongoose from 'mongoose';
import { z } from 'zod';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  aiSuggestion: String,
  dueDate: Date,
  reminder: Date,
  checkpoints: [String],
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Task = mongoose.model('Task', taskSchema);

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const insertTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  userId: z.string(),
  aiSuggestion: z.string().optional(),
  dueDate: z.date().optional(),
  reminder: z.date().optional(),
  checkpoints: z.array(z.string()).optional(),
  status: z.string().optional()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;