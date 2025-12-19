import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../../../shared/types';
import { TestimonialsService } from '../services/testimonials.service';
import type { TestimonialsFilters } from '../types/testimonials.types';

export class TestimonialsController {
    private testimonialsService: TestimonialsService;

    constructor() {
        this.testimonialsService = new TestimonialsService();
    }

    getTestimonials = async (
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const isFeaturedParam = req.query.is_featured as string | undefined;
            const pageParam = req.query.page as string | undefined;
            const limitParam = req.query.limit as string | undefined;

            const filters: TestimonialsFilters = {
                ...(isFeaturedParam && { isFeatured: isFeaturedParam === 'true' }),
                page: Number.parseInt(pageParam || '1', 10),
                limit: Number.parseInt(limitParam || '10', 10),
            };

            const result = await this.testimonialsService.getTestimonials(filters);

            res.status(200).json({
                success: true,
                message: 'Testimonials retrieved successfully',
                data: result.testimonials,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    };
}
