import { TaskModel } from '../models/task.model';
import { CreateTaskDto, CreateTaskListDto, Task, TaskList, TasksResponse, UpdateTaskDto } from '../types/task.types';
import { ValidationError } from '../../../shared/errors/application.errors';

export class TaskService {
  constructor(private taskModel: TaskModel) {}

  async getUserTasks(userId: number): Promise<TasksResponse> {
    const taskLists = await this.taskModel.getTaskListsByUserId(userId);
    const tasks = await this.taskModel.getAllTasksForUser(userId);
    return { taskLists, tasks };
  }

  async createTaskList(userId: number, data: CreateTaskListDto): Promise<TaskList> {
    if (!data.name || data.name.trim() === '') {
      throw new ValidationError('Task list name is required');
    }
    
    return this.taskModel.createTaskList(userId, {
      name: data.name.trim()
    });
  }

  async createTask(userId: number, data: CreateTaskDto): Promise<Task> {
    if (!data.description || data.description.trim() === '') {
      throw new ValidationError('Task description is required');
    }
    
    // Validate task_list_id belongs to user
    const taskLists = await this.taskModel.getTaskListsByUserId(userId);
    const isValidTaskList = taskLists.some(list => list.id === data.task_list_id);
    
    if (!isValidTaskList) {
      throw new ValidationError('Invalid task list ID');
    }
    
    return this.taskModel.createTask({
      task_list_id: data.task_list_id,
      description: data.description.trim(),
      due_date: data.due_date,
      status: data.status || 'pending',
      priority: data.priority || 3
    });
  }

  async updateTask(userId: number, taskId: number, data: UpdateTaskDto): Promise<Task> {
    // First check if the task belongs to this user
    const tasks = await this.taskModel.getAllTasksForUser(userId);
    const taskExists = tasks.some(task => task.id === taskId);
    
    if (!taskExists) {
      throw new ValidationError('Task not found or you do not have permission to update it');
    }
    
    return this.taskModel.updateTask(taskId, data);
  }

  async deleteTask(userId: number, taskId: number): Promise<boolean> {
    // First check if the task belongs to this user
    const tasks = await this.taskModel.getAllTasksForUser(userId);
    const taskExists = tasks.some(task => task.id === taskId);
    
    if (!taskExists) {
      throw new ValidationError('Task not found or you do not have permission to delete it');
    }
    
    await this.taskModel.deleteTask(taskId);
    return true;
  }

  async deleteTaskList(userId: number, taskListId: number): Promise<boolean> {
    // First check if the task list belongs to this user
    const taskLists = await this.taskModel.getTaskListsByUserId(userId);
    const taskListExists = taskLists.some(list => list.id === taskListId);
    
    if (!taskListExists) {
      throw new ValidationError('Task list not found or you do not have permission to delete it');
    }
    
    await this.taskModel.deleteTaskList(taskListId);
    return true;
  }
} 