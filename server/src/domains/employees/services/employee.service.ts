import { Pool } from 'pg';
import { EmployeeModel } from '../models/employee.model';
import { Employee, EmployeeFormData } from '../types/employee.types';
import { ValidationError } from '../../../shared/errors/application.errors';

export class EmployeeService {
  private employeeModel: EmployeeModel;

  constructor(pool: Pool) {
    this.employeeModel = new EmployeeModel(pool);
  }

  async getAllEmployees(companyId: number): Promise<Employee[]> {
    return this.employeeModel.findByCompanyId(companyId);
  }

  async getEmployeeProfile(userId: number): Promise<Employee> {
    const employee = await this.employeeModel.findById(userId);
    if (!employee) {
      throw new ValidationError('Employee not found');
    }
    return employee;
  }

  async createEmployee(data: EmployeeFormData, creatorId: number): Promise<Employee> {
    // Validate required fields
    const requiredFields = ['email', 'first_name', 'last_name', 'job_title'] as const;
    const missingFields = requiredFields.filter(field => !data[field as keyof EmployeeFormData]);
    
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Check if email exists
    const existingUser = await this.employeeModel.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    return this.employeeModel.create(data, creatorId);
  }

  async updateEmployeeProfile(userId: number, updates: Partial<Employee>): Promise<Employee> {
    const employee = await this.employeeModel.findById(userId);
    if (!employee) {
      throw new ValidationError('Employee not found');
    }
    return this.employeeModel.update(userId, updates);
  }

  async getTeamMembers(managerId: number): Promise<Employee[]> {
    return this.employeeModel.findByManagerId(managerId);
  }

  async updateTeamMember(employeeId: number, managerId: number, updates: Partial<Employee>): Promise<Employee> {
    // Verify the employee is part of the manager's team
    const employee = await this.employeeModel.findById(employeeId);
    if (!employee || employee.manager_id !== managerId) {
      throw new ValidationError('Employee not found in your team');
    }
    
    // Filter allowed fields for manager updates
    const allowedUpdates = {
      job_title: updates.job_title,
      team_id: updates.team_id,
      employment_status: updates.employment_status,
      job_level: updates.job_level
    };

    return this.employeeModel.update(employeeId, allowedUpdates);
  }
}
