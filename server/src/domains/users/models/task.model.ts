import { Pool } from 'pg';
import { DatabaseError } from '../../../shared/errors/application.errors';
import { Task, TaskList, CreateTaskDto, UpdateTaskDto, CreateTaskListDto } from '../types/task.types';

export class TaskModel {
  constructor(private db: Pool) {}

  async getTaskListsByUserId(userId: number): Promise<TaskList[]> {
    const query = `
      SELECT * FROM task_lists
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    try {
      const { rows } = await this.db.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch task lists');
    }
  }

  async getTasksByTaskListId(taskListId: number): Promise<Task[]> {
    const query = `
      SELECT * FROM tasks
      WHERE task_list_id = $1
      ORDER BY priority DESC, created_at DESC
    `;

    try {
      const { rows } = await this.db.query(query, [taskListId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch tasks');
    }
  }

  async getAllTasksForUser(userId: number): Promise<Task[]> {
    const query = `
      SELECT t.* FROM tasks t
      JOIN task_lists tl ON t.task_list_id = tl.id
      WHERE tl.user_id = $1
      ORDER BY t.priority DESC, t.created_at DESC
    `;

    try {
      const { rows } = await this.db.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch tasks');
    }
  }

  async createTaskList(userId: number, data: CreateTaskListDto): Promise<TaskList> {
    const query = `
      INSERT INTO task_lists (user_id, name)
      VALUES ($1, $2)
      RETURNING *
    `;

    try {
      const { rows } = await this.db.query(query, [userId, data.name]);
      return rows[0];
    } catch (error) {
      throw new DatabaseError('Failed to create task list');
    }
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const query = `
      INSERT INTO tasks (task_list_id, description, due_date, status, priority)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    try {
      const { rows } = await this.db.query(query, [
        data.task_list_id,
        data.description,
        data.due_date || null,
        data.status || 'pending',
        data.priority || 3
      ]);
      return rows[0];
    } catch (error) {
      throw new DatabaseError('Failed to create task');
    }
  }

  async updateTask(taskId: number, data: UpdateTaskDto): Promise<Task> {
    // Build the dynamic update query based on provided fields
    let updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      values.push(data.description);
      paramIndex++;
    }

    if (data.due_date !== undefined) {
      updateFields.push(`due_date = $${paramIndex}`);
      values.push(data.due_date);
      paramIndex++;
    }

    if (data.status !== undefined) {
      updateFields.push(`status = $${paramIndex}`);
      values.push(data.status);
      paramIndex++;
    }

    if (data.priority !== undefined) {
      updateFields.push(`priority = $${paramIndex}`);
      values.push(data.priority);
      paramIndex++;
    }

    updateFields.push(`updated_at = NOW()`);

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE tasks
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    values.push(taskId);

    try {
      const { rows } = await this.db.query(query, values);
      if (rows.length === 0) {
        throw new Error('Task not found');
      }
      return rows[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(`Failed to update task: ${error.message}`);
      }
      throw new DatabaseError('Failed to update task');
    }
  }

  async deleteTask(taskId: number): Promise<void> {
    const query = `
      DELETE FROM tasks
      WHERE id = $1
      RETURNING id
    `;

    try {
      const { rowCount } = await this.db.query(query, [taskId]);
      if (rowCount === 0) {
        throw new Error('Task not found');
      }
    } catch (error) {
      throw new DatabaseError('Failed to delete task');
    }
  }

  async deleteTaskList(taskListId: number): Promise<void> {
    const query = `
      DELETE FROM task_lists
      WHERE id = $1
      RETURNING id
    `;

    try {
      const { rowCount } = await this.db.query(query, [taskListId]);
      if (rowCount === 0) {
        throw new Error('Task list not found');
      }
    } catch (error) {
      throw new DatabaseError('Failed to delete task list');
    }
  }
} 