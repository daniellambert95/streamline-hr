import { UserModel } from '../models/user.model';
import { NotificationModel } from '../models/notification.model';
import { MessageModel } from '../models/message.model';
import { User, UserCreationDTO, UserUpdateDTO } from '../types/user.types';
import { ValidationError } from '../../../shared/errors/application.errors';
import bcrypt from '@node-rs/bcrypt';
import { Pool } from 'pg';

export class UserService {
  private notificationModel: NotificationModel;
  private messageModel: MessageModel;

  constructor(
    private userModel: UserModel,
    private db: Pool
  ) {
    this.notificationModel = new NotificationModel(db);
    this.messageModel = new MessageModel(db);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new ValidationError('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findByEmail(email);
  }

  async getCompanyUsers(userId: number): Promise<any[]> {
    try {
      // First get the company ID of the current user
      const query1 = `
        SELECT company_id 
        FROM employees 
        WHERE id = $1
      `;
      const { rows: companyRows } = await this.db.query(query1, [userId]);
      
      if (companyRows.length === 0) {
        return [];
      }
      
      const companyId = companyRows[0].company_id;
      
      // Then get all users from the same company - simplified query
      const query2 = `
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.email
        FROM users u
        JOIN employees e ON u.id = e.id
        WHERE e.company_id = $1
        ORDER BY u.first_name, u.last_name
      `;
      
      const { rows: userRows } = await this.db.query(query2, [companyId]);
      return userRows;
    } catch (error) {
      console.error('Error fetching company users:', error);
      throw new Error('Failed to fetch company users');
    }
  }

  async createUser(userData: UserCreationDTO): Promise<User> {
    const existingUser = await this.userModel.findByEmail(userData.email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.userModel.create({
      ...userData,
      password: hashedPassword
    });
  }

  async updateUser(id: number, userData: UserUpdateDTO): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (userData.email) {
      const existingUser = await this.userModel.findByEmail(userData.email);
      if (existingUser && existingUser.id !== id) {
        throw new ValidationError('Email already exists');
      }
    }

    return this.userModel.update(id, userData);
  }

  async getUserNotifications(userId: number): Promise<any[]> {
    return this.notificationModel.getNotificationsByUserId(userId);
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    return this.notificationModel.getUnreadNotificationsCount(userId);
  }

  async getUserMessages(userId: number): Promise<any[]> {
    return this.messageModel.getMessagesByUserId(userId);
  }

  async getUnreadMessagesCount(userId: number): Promise<number> {
    return this.messageModel.getUnreadMessagesCount(userId);
  }

  async getAllUserNotifications(userId: number): Promise<any[]> {
    return this.notificationModel.getAllNotificationsByUserId(userId);
  }

  async markNotificationAsRead(notificationId: number, userId: number): Promise<void> {
    await this.notificationModel.markAsRead(notificationId, userId);
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    await this.notificationModel.markAllAsRead(userId);
  }

  async deleteNotification(notificationId: number, userId: number): Promise<void> {
    await this.notificationModel.deleteNotification(notificationId, userId);
  }

  async getAllUserMessages(userId: number): Promise<any[]> {
    return this.messageModel.getAllMessagesByUserId(userId);
  }

  async sendMessage(senderId: number, recipientId: number, subject: string, content: string): Promise<any> {
    return this.messageModel.createMessage(senderId, recipientId, subject, content);
  }

  async markMessageAsRead(messageId: number, userId: number): Promise<void> {
    await this.messageModel.markAsRead(messageId, userId);
  }

  async deleteMessage(messageId: number, userId: number): Promise<void> {
    await this.messageModel.deleteMessage(messageId, userId);
  }

  async markNotificationAsUnread(notificationId: number, userId: number): Promise<void> {
    await this.notificationModel.markAsUnread(notificationId, userId);
  }

  async markMessageAsUnread(messageId: number, userId: number): Promise<void> {
    await this.messageModel.markAsUnread(messageId, userId);
  }

  async markMessageAsImportant(id: number, userId: number): Promise<void> {
    const query = `
      UPDATE messages 
      SET is_important = TRUE
      WHERE id = $1 AND recipient_id = $2
    `;
    await this.db.query(query, [id, userId]);
  }
  
  async unmarkMessageAsImportant(id: number, userId: number): Promise<void> {
    const query = `
      UPDATE messages 
      SET is_important = FALSE
      WHERE id = $1 AND recipient_id = $2
    `;
    await this.db.query(query, [id, userId]);
  }
}
