import type { Request } from 'express';
import type { User } from '../../database/schema';
import type { SubscriptionStatus } from '../../modules/payment/types';

export interface AuthRequest extends Request {
    user?: User;
    subscription?: SubscriptionStatus;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string;
}

export interface JWTPayload {
    userId: string;
    email: string;
}
