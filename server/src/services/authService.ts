import { UserModel } from '../models/User';
import { generateToken } from '../utils/jwt';
import { UserResponse } from '../types/index';

export class AuthService {
  static async register(username: string, password: string, email?: string, full_name?: string) {
    // Check if username already exists
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const user = await UserModel.create(username, password, email, full_name);
    return user;
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
