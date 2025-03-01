export interface TaskList {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  task_list_id: number;
  description: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface TasksResponse {
  taskLists: TaskList[];
  tasks: Task[];
}

export interface CreateTaskListRequest {
  name: string;
}

export interface CreateTaskRequest {
  task_list_id: number;
  description: string;
  due_date?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: number;
}

export interface UpdateTaskRequest {
  description?: string;
  due_date?: string | null;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: number;
} 