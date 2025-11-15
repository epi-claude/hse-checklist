import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/index';

const JWT_SECRET: string = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || '7d';

export function generateToken(payload: JWTPayload): string {
  // @ts-ignore - JWT types are incorrect for string expiresIn
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
