import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { validateSchema } from '../../../shared/utils/validation';

export const registerSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be at most 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
    email: z.string().email('Invalid email format').toLowerCase(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain lowercase, uppercase, and numbers'
        ),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export function validateRegister(req: Request, _res: Response, next: NextFunction): void {
    try {
        validateSchema(registerSchema, req.body);
        next();
    } catch (error) {
        next(error);
    }
}

export const loginSchema = z.object({
    email: z.string().email('Invalid email format').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export function validateLogin(req: Request, _res: Response, next: NextFunction): void {
    try {
        validateSchema(loginSchema, req.body);
        next();
    } catch (error) {
        next(error);
    }
}
