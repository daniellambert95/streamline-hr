import { Request, Response } from 'express';
import { EmployeeService } from '../../employees/services/employee.service';
import { UserService } from '../../users/services/user.service';
import { ValidationError } from '../../../shared/errors/application.errors';

export class DashboardController {
  constructor(
    private employeeService: EmployeeService,
    private userService: UserService
  ) {}

  getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get complete user profile including company info
      const userProfile = await this.userService.getUserById(req.user!.id);
      
      // Get employee profile
      const employeeProfile = await this.employeeService.getEmployeeProfile(req.user!.id);

      // Get notifications and messages
      const notifications = await this.userService.getUserNotifications(req.user!.id);
      const unreadNotificationsCount = await this.userService.getUnreadNotificationsCount(req.user!.id);
      const messages = await this.userService.getUserMessages(req.user!.id);
      const unreadMessagesCount = await this.userService.getUnreadMessagesCount(req.user!.id);

      // Combine the data
      const dashboardData = {
        user: {
          ...userProfile,
          ...employeeProfile
        },
        notifications,
        unreadNotificationsCount,
        messages,
        unreadMessagesCount
      };

      res.json(dashboardData);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
      }
    }
  };
}