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

      // Combine the data
      const dashboardData = {
        user: {
          ...userProfile,
          ...employeeProfile
        },
        // Add other dashboard specific data here
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