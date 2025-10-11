import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { JWTPayload } from '../types';

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN
    } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
}