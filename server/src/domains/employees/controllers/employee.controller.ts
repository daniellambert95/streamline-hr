import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';
import { ValidationError } from '../../../shared/errors/application.errors';

export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  getAllEmployees = async (req: Request, res: Response): Promise<void> => {
    try {
      const employees = await this.employeeService.getAllEmployees(req.user.company_id);
      res.json(employees);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch employees' });
      }
    }
  };

  getEmployeeById = async (req: Request, res: Response): Promise<void> => {
    try {
      const employee = await this.employeeService.getEmployeeProfile(parseInt(req.params.id));
      res.json(employee);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch employee' });
      }
    }
  };

  createEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      const newEmployee = await this.employeeService.createEmployee(req.body, req.user.id);
      res.status(201).json(newEmployee);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create employee' });
      }
    }
  };

  updateEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Employee update request:', {
        employeeId: req.params.id,
        userId: req.user?.id,
        userRole: req.user?.role,
        updateData: req.body
      });

      const updatedEmployee = await this.employeeService.updateEmployeeProfile(
        parseInt(req.params.id),
        req.body
      );
      
      console.log('Employee updated successfully:', updatedEmployee);
      res.json(updatedEmployee);
    } catch (error) {
      console.error('Employee update error:', error);
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update employee' });
      }
    }
  };

  getOwnProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const profile = await this.employeeService.getEmployeeProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch profile' });
      }
    }
  };

  updateOwnProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedProfile = await this.employeeService.updateEmployeeProfile(
        req.user.id,
        req.body
      );
      
      res.json(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update profile' });
      }
    }
  };

  getTeamMembers = async (req: Request, res: Response): Promise<void> => {
    try {
      const teamMembers = await this.employeeService.getTeamMembers(req.user.id);
      res.json(teamMembers);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to fetch team members' });
      }
    }
  };

  updateTeamMember = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedMember = await this.employeeService.updateTeamMember(
        parseInt(req.params.id),
        req.user.id,
        req.body
      );
      res.json(updatedMember);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update team member' });
      }
    }
  };
}
