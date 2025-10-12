import { db } from '../database/sqlite.js';
import { User, UserResponse } from '../types/index.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export class UserModel {
  static async create(username: string, password: string, email?: string, full_name?: string): Promise<UserResponse> {
    const id = randomUUID();
    const password_hash = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (id, username, password_hash, email, full_name)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, username, password_hash, email || null, full_name || null);

    return {
      id,
      username,
      email,
      full_name,
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

  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    };
  }
}
