import { NextFunction, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../../config/database';
import { users } from '../../../database/schema';
import { verifyToken } from '../../../shared/utils/jwt';
import { AppError } from '../../../shared/middleware/error-handler';
import { AuthRequest } from '../../../shared/types';

export async function authenticateToken(
    req: AuthRequest,
    _res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        // const authHeader = req.headers.authorization;
        // const token = authHeader && authHeader.split(' ')[1];

        const token = req.cookies.token;

        if (!token) {
            return next();
        }

        const payload = verifyToken(token);
        if (!payload) {
            throw new AppError('Invalid token', 401);
        }

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, payload.userId))
            .limit(1);

        if (!user) {
            throw new AppError('User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}