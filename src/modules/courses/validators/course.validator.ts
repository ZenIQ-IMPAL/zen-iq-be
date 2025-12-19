import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { validateSchema } from '../../../shared/utils/validation';

export const getCourseListSchema = z.object({
    category: z.string().optional(),
    is_free: z
        .string()
        .optional()
        .transform((val) => val === 'true'),
    difficulty_level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    search: z.string().optional(),
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10)),
});

export const getCourseByIdSchema = z.object({
    id: z.string().uuid({
        message: 'Invalid course ID format',
    }),
});

export type GetCourseListInput = z.infer<typeof getCourseListSchema>;
export type GetCourseByIdInput = z.infer<typeof getCourseByIdSchema>;

export function validateGetCourseList(req: Request, _res: Response, next: NextFunction): void {
    try {
        validateSchema(getCourseListSchema, req.query);
        next();
    } catch (error) {
        next(error);
    }
}

export function validateGetCourseById(req: Request, _res: Response, next: NextFunction): void {
    try {
        validateSchema(getCourseByIdSchema, req.params);
        next();
    } catch (error) {
        next(error);
    }
}
