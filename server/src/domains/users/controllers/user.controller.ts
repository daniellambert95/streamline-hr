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
      const users = await this.userService.getCompanyUsers(req.user!.company_name);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch company users' });
    }
  };
}
