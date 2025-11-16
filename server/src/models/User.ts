import { db } from '../database/sqlite';
import { User, UserResponse } from '../types/index';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export class UserModel {
  static async create(username: string, password: string, email?: string, full_name?: string, organization?: string): Promise<UserResponse> {
    const id = randomUUID();
    const password_hash = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (id, username, password_hash, email, full_name, organization)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, username, password_hash, email || null, full_name || null, organization || null);

    return {
      id,
      username,
      email,
      full_name,
      organization,
      role: 'user',
    };
  }

  static async findByUsername(username: string): Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user = stmt.get(username) as User | undefined;
    return user || null;
  }

  static async findById(id: string): Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id) as User | undefined;
    return user || null;
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async updateProfile(userId: string, email?: string, full_name?: string, organization?: string): Promise<User | null> {
    const stmt = db.prepare(`
      UPDATE users
      SET email = ?, full_name = ?, organization = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(email || null, full_name || null, organization || null, userId);

    return this.findById(userId);
  }

  static async updatePassword(userId: string, newPassword: string): Promise<void> {
    const password_hash = await bcrypt.hash(newPassword, 10);
    const stmt = db.prepare(`
      UPDATE users
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(password_hash, userId);
  }

  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      organization: user.organization,
      role: user.role,
    };
  }
}
