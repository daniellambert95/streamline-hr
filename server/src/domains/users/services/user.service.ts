import { UserModel } from '../models/user.model';
import { User, UserCreationDTO, UserUpdateDTO } from '../types/user.types';
import { ValidationError } from '../../../shared/errors/application.errors';
import bcrypt from '@node-rs/bcrypt';

export class UserService {
  constructor(private userModel: UserModel) {}

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

  async getCompanyUsers(companyName: string): Promise<User[]> {
    return this.userModel.findByCompany(companyName);
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
}
