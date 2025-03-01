import { Pool } from 'pg';
import { DatabaseError } from '../../../shared/errors/application.errors';

export class MessageModel {
  constructor(private db: Pool) {}

  async getMessagesByUserId(userId: number, limit: number = 3): Promise<any[]> {
    const query = `
      SELECT 
        m.id, 
        m.subject, 
        m.content, 
        m.is_read, 
        m.sent_at,
        u.first_name as sender_first_name,
        u.last_name as sender_last_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.recipient_id = $1
      ORDER BY m.sent_at DESC
      LIMIT $2
    `;

    try {
      const { rows } = await this.db.query(query, [userId, limit]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch messages');
    }
  }

  async getUnreadMessagesCount(userId: number): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM messages
      WHERE recipient_id = $1 AND is_read = false
    `;

    try {
      const { rows } = await this.db.query(query, [userId]);
      return parseInt(rows[0].count);
    } catch (error) {
      throw new DatabaseError('Failed to fetch unread messages count');
    }
  }

  async getAllMessagesByUserId(userId: number): Promise<any[]> {
    const query = `
      SELECT 
        m.id, 
        m.subject, 
        m.content, 
        m.is_read, 
        m.sent_at,
        u.first_name as sender_first_name,
        u.last_name as sender_last_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.recipient_id = $1
      ORDER BY m.sent_at DESC
    `;

    try {
      const { rows } = await this.db.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new DatabaseError('Failed to fetch messages');
    }
  }

  async createMessage(senderId: number, recipientId: number, subject: string, content: string): Promise<any> {
    const query = `
      INSERT INTO messages 
        (sender_id, recipient_id, subject, content, is_read)
      VALUES 
        ($1, $2, $3, $4, false)
      RETURNING id, subject, content, sent_at
    `;

    try {
      const { rows } = await this.db.query(query, [senderId, recipientId, subject, content]);
      return rows[0];
    } catch (error) {
      throw new DatabaseError('Failed to create message');
    }
  }

  async markAsRead(messageId: number, userId: number): Promise<void> {
    const query = `
      UPDATE messages
      SET is_read = true
      WHERE id = $1 AND recipient_id = $2
    `;

    try {
      await this.db.query(query, [messageId, userId]);
    } catch (error) {
      throw new DatabaseError('Failed to mark message as read');
    }
  }

  async deleteMessage(messageId: number, userId: number): Promise<void> {
    const query = `
      DELETE FROM messages
      WHERE id = $1 AND recipient_id = $2
    `;

    try {
      await this.db.query(query, [messageId, userId]);
    } catch (error) {
      throw new DatabaseError('Failed to delete message');
    }
  }

  async markAsUnread(messageId: number, userId: number): Promise<void> {
    const query = `
      UPDATE messages
      SET is_read = false
      WHERE id = $1 AND recipient_id = $2
    `;

    try {
      await this.db.query(query, [messageId, userId]);
    } catch (error) {
      throw new DatabaseError('Failed to mark message as unread');
    }
  }
} 