import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { validateSchema } from '../../../shared/utils/validation';

export const registerSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Nama lengkap minimal 2 karakter')
        .max(100, 'Nama lengkap maksimal 100 karakter')
        .regex(/^[a-zA-Z\s]+$/, 'Nama lengkap hanya boleh berisi huruf dan spasi'),
    email: z
        .string()
        .email('Format email tidak valid')
        .toLowerCase(),
    password: z
        .string()
        .min(8, 'Password minimal 8 karakter')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password harus mengandung huruf kecil, huruf besar, dan angka'),
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
    email: z
        .string()
        .email('Format email tidak valid')
        .toLowerCase(),
    password: z.string().min(8, 'Password minimal 8 karakter'),
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