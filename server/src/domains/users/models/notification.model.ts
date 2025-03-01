import { Pool } from 'pg';
import { DatabaseError } from '../../../shared/errors/application.errors';

export class NotificationModel {
  constructor(private db: Pool) {}

  async getNotificationsByUserId(userId: number, limit: number = 3): Promise<any[]> {
    const query = `
      SELECT 
        n.id, 
        n.type, 
        n.message, 
        n.is_read, 
        n.created_at,
        u.first_name as sender_first_name,
        u.last_name as sender_last_name
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
      WHERE n.recipient_id = $1
      ORDER BY n.created_at DESC
      LIMIT $2
    `;

    try {
      const { rows } = await this.db.query(query, [userId, limit]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch notifications');
    }
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE recipient_id = $1 AND is_read = false
    `;

    try {
      const { rows } = await this.db.query(query, [userId]);
      return parseInt(rows[0].count);
    } catch (error) {
      throw new DatabaseError('Failed to fetch unread notifications count');
    }
  }

  async getAllNotificationsByUserId(userId: number): Promise<any[]> {
    const query = `
      SELECT 
        n.id, 
        n.type, 
        n.message, 
        n.is_read, 
        n.created_at,
        u.first_name as sender_first_name,
        u.last_name as sender_last_name
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
      WHERE n.recipient_id = $1
      ORDER BY n.created_at DESC
    `;

    try {
      const { rows } = await this.db.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch notifications');
    }
  }

  async markAsRead(notificationId: number, userId: number): Promise<void> {
    const query = `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1 AND recipient_id = $2
    `;

    try {
      await this.db.query(query, [notificationId, userId]);
    } catch (error) {
      throw new DatabaseError('Failed to mark notification as read');
    }
  }

  async markAllAsRead(userId: number): Promise<void> {
    const query = `
      UPDATE notifications
      SET is_read = true
      WHERE recipient_id = $1
    `;

    try {
      await this.db.query(query, [userId]);
    } catch (error) {
      throw new DatabaseError('Failed to mark all notifications as read');
    }
  }

  async deleteNotification(notificationId: number, userId: number): Promise<void> {
    const query = `
      DELETE FROM notifications
      WHERE id = $1 AND recipient_id = $2
    `;

    try {
      await this.db.query(query, [notificationId, userId]);
    } catch (error) {
      throw new DatabaseError('Failed to delete notification');
    }
  }

  async markAsUnread(notificationId: number, userId: number): Promise<void> {
    const query = `
      UPDATE notifications
      SET is_read = false
      WHERE id = $1 AND recipient_id = $2
    `;

    try {
      await this.db.query(query, [notificationId, userId]);
    } catch (error) {
      throw new DatabaseError('Failed to mark notification as unread');
    }
  }
} 