import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateTaskSuggestions, getTaskAssistance } from "./ai";
import { insertTaskSchema } from "@shared/schema";
import { ZodError } from "zod";

interface WebSocketClient extends WebSocket {
  userId?: number;
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  app.get("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tasks = await storage.getTasksByUserId(req.user.id);
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const taskData = insertTaskSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      if (taskData.title) {
        const aiSuggestion = await generateTaskSuggestions(taskData.title);
        taskData.aiSuggestion = aiSuggestion;
      }

      const task = await storage.createTask(taskData);

      // Broadcast to all connected clients for this user
      wss.clients.forEach((client: WebSocketClient) => {
        if (client.userId === req.user.id && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "TASK_CREATED", task }));
        }
      });

      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);

      if (!task || task.userId !== req.user.id) {
        return res.status(404).json({ message: "Task not found" });
      }

      const updatedTask = await storage.updateTask(taskId, req.body);

      wss.clients.forEach((client: WebSocketClient) => {
        if (client.userId === req.user.id && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "TASK_UPDATED", task: updatedTask }));
        }
      });

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/tasks/assist", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { taskId, query } = req.body;
      const task = await storage.getTask(taskId);

      if (!task || task.userId !== req.user.id) {
        return res.status(404).json({ message: "Task not found" });
      }

      const assistance = await getTaskAssistance(query, task.title);
      res.json(JSON.parse(assistance));
    } catch (error) {
      console.error("Task assistance error:", error);
      res.status(500).json({ message: "Failed to get AI assistance" });
    }
  });

  wss.on("connection", (ws: WebSocketClient) => {
    ws.on("message", (message: string) => {
      try {
        const data = JSON.parse(message);
        if (data.type === "AUTH" && data.userId) {
          ws.userId = data.userId;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
  });

  return httpServer;
}