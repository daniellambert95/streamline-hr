import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { ValidationError } from '../../../shared/errors/application.errors';

export class TaskController {
  constructor(private taskService: TaskService) {}

  getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.getUserTasks(req.user!.id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  };

  createTaskList = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskList = await this.taskService.createTaskList(req.user!.id, req.body);
      res.status(201).json(taskList);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create task list' });
      }
    }
  };

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.createTask(req.user!.id, req.body);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create task' });
      }
    }
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await this.taskService.updateTask(req.user!.id, taskId, req.body);
      res.json(task);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update task' });
      }
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = parseInt(req.params.id);
      await this.taskService.deleteTask(req.user!.id, taskId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete task' });
      }
    }
  };

  deleteTaskList = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskListId = parseInt(req.params.id);
      await this.taskService.deleteTaskList(req.user!.id, taskListId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete task list' });
      }
    }
  };
} 