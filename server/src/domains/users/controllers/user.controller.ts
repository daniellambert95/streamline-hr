import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ValidationError } from '../../../shared/errors/application.errors';

export class UserController {
  constructor(private userService: UserService) {}

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.getUserById(req.user!.id);
      res.json(user);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch user profile' });
      }
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedUser = await this.userService.updateUser(req.user!.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update user profile' });
      }
    }
  };

  getCompanyUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getCompanyUsers(req.user!.id);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch company users' });
    }
  };

  getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const notifications = await this.userService.getUserNotifications(req.user!.id);
      const unreadCount = await this.userService.getUnreadNotificationsCount(req.user!.id);
      res.json({ notifications, unreadCount });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  };

  getUserMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const messages = await this.userService.getUserMessages(req.user!.id);
      const unreadCount = await this.userService.getUnreadMessagesCount(req.user!.id);
      res.json({ messages, unreadCount });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  };

  getAllUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const notifications = await this.userService.getAllUserNotifications(req.user!.id);
      res.json({ notifications });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  };

  markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.markNotificationAsRead(parseInt(id), req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  };

  markAllNotificationsAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.userService.markAllNotificationsAsRead(req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
  };

  deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.deleteNotification(parseInt(id), req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  };

  getAllUserMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const messages = await this.userService.getAllUserMessages(req.user!.id);
      res.json({ messages });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  };

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { recipient_id, subject, content } = req.body;
      
      if (!recipient_id || !subject || !content) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      
      const message = await this.userService.sendMessage(
        req.user!.id,
        parseInt(recipient_id),
        subject,
        content
      );
      
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  };

  markMessageAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.markMessageAsRead(parseInt(id), req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark message as read' });
    }
  };

  deleteMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.deleteMessage(parseInt(id), req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete message' });
    }
  };

  markNotificationAsUnread = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.markNotificationAsUnread(parseInt(id), req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification as unread' });
    }
  };

  markMessageAsUnread = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.markMessageAsUnread(parseInt(id), req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark message as unread' });
    }
  };

  markMessageAsImportant = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.markMessageAsImportant(parseInt(id), req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark message as important' });
    }
  };

  unmarkMessageAsImportant = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.unmarkMessageAsImportant(parseInt(id), req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to unmark message as important' });
    }
  };
}
