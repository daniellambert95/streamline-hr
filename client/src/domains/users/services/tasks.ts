import api from '../../../core/api/apiClient';
import { 
  TasksResponse, 
  Task, 
  TaskList, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  CreateTaskListRequest 
} from '../types/task.types';

export const taskService = {
  getAllTasks: () => 
    api.get<TasksResponse>('/api/v1/users/tasks'),
    
  createTaskList: (data: CreateTaskListRequest) => 
    api.post<TaskList>('/api/v1/users/tasks/lists', data),
    
  createTask: (data: CreateTaskRequest) => 
    api.post<Task>('/api/v1/users/tasks', data),
    
  updateTask: (id: number, data: UpdateTaskRequest) => 
    api.put<Task>(`/api/v1/users/tasks/${id}`, data),
    
  deleteTask: (id: number) => 
    api.delete<void>(`/api/v1/users/tasks/${id}`),
    
  deleteTaskList: (id: number) => 
    api.delete<void>(`/api/v1/users/tasks/lists/${id}`)
}; 