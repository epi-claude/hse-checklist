import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, email, full_name, organization } = req.body;

      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
      }

      const user = await AuthService.register(username, password, email, full_name, organization);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
      }

      const { token, user } = await AuthService.login(username, password);

      res.json({
        success: true,
        token,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const user = await AuthService.getUser(req.user.userId);

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { email, full_name, organization } = req.body;
      const user = await AuthService.updateProfile(req.user.userId, email, full_name, organization);

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current password and new password are required' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
      }

      await AuthService.changePassword(req.user.userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
