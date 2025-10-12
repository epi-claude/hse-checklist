import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  if (err.message === 'Username already exists') {
    return res.status(409).json({ success: false, message: err.message });
  }

  if (err.message === 'Invalid credentials' || err.message === 'User not found') {
    return res.status(401).json({ success: false, message: err.message });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}
