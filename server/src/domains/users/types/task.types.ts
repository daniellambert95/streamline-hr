export interface TaskList {
  id: number;
  user_id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: number;
  task_list_id: number;
  description: string;
  due_date?: Date;
  status: 'pending' | 'in_progress' | 'completed';
  priority: number; // 1-5 where 5 is highest
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskListDto {
  name: string;
}

export interface CreateTaskDto {
  task_list_id: number;
  description: string;
  due_date?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: number;
}

export interface UpdateTaskDto {
  description?: string;
  due_date?: string | null;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: number;
}

export interface TasksResponse {
  taskLists: TaskList[];
  tasks: Task[];
} 