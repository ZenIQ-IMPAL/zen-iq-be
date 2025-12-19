import { eq } from 'drizzle-orm';
import type { NextFunction, Response } from 'express';
import { db } from '../../../config/database';
import { users } from '../../../database/schema';
import { AppError } from '../../../shared/middleware/error-handler';
import type { AuthRequest } from '../../../shared/types';
import { verifyToken } from '../../../shared/utils/jwt';

export async function authenticateToken(
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        // const token = req.cookies.token;

        if (!token) {
            return next();
        }

        const payload = verifyToken(token);
        if (!payload) {
            throw new AppError('Invalid token', 401);
        }

        const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);

        if (!user) {
            throw new AppError('User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

export async function authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized - No token provided',
            });
            return;
        }

        const payload = verifyToken(token);
        if (!payload) {
            throw new AppError('Invalid token', 401);
        }

        const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);

        if (!user) {
            throw new AppError('User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}
