import { Request } from 'express';
import { User } from '../../database/schema';

export interface AuthRequest extends Request {
    user?: User;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface JWTPayload {
    userId: string;
    email: string;
}