import { UserModel } from '../models/User';
import { generateToken } from '../utils/jwt';
import { UserResponse } from '../types/index';

export class AuthService {
  static async register(username: string, password: string, email?: string, full_name?: string, organization?: string) {
    // Check if username already exists
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const user = await UserModel.create(username, password, email, full_name, organization);
    return user;
  }

  static async updateProfile(userId: string, email?: string, full_name?: string, organization?: string) {
    const user = await UserModel.updateProfile(userId, email, full_name, organization);
    if (!user) {
      throw new Error('User not found');
    }
    return UserModel.toResponse(user);
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await UserModel.verifyPassword(currentPassword, user.password_hash);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    await UserModel.updatePassword(userId, newPassword);
    return true;
  }

  static async login(username: string, password: string): Promise<{ token: string; user: UserResponse }> {
    const user = await UserModel.findByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await UserModel.verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({ userId: user.id, username: user.username });
    const userResponse = UserModel.toResponse(user);

    return { token, user: userResponse };
  }

  static async getUser(userId: string): Promise<UserResponse> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return UserModel.toResponse(user);
  }
}
