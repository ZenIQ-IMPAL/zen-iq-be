import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { validateSchema } from '../../../shared/utils/validation';

const getTestimonialsSchema = z.object({
	is_featured: z
		.enum(['true', 'false'])
		.optional()
		.transform((val) => val === 'true'),
	page: z
		.string()
		.optional()
		.transform((val) => Number.parseInt(val || '1', 10)),
	limit: z
		.string()
		.optional()
		.transform((val) => Number.parseInt(val || '10', 10)),
});

export const validateGetTestimonials = (
	req: Request,
	_res: Response,
	next: NextFunction,
): void => {
	validateSchema(getTestimonialsSchema, req.query);
	next();
};
