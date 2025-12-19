import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../../../shared/types';
import { logger } from '../../../shared/utils/logger';
import { CourseService } from '../services/course.service';
import type { CourseFilters } from '../types/course.types';

export class CourseController {
    private courseService: CourseService;

    constructor() {
        this.courseService = new CourseService();
    }

    getCourses = async (
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const isFreeParam = req.query.is_free as string | undefined;
            const isFreeValue =
                isFreeParam === 'true' ? true : isFreeParam === 'false' ? false : undefined;

            const filters: CourseFilters = {
                ...(req.query.category && { category: req.query.category as string }),
                ...(isFreeValue !== undefined && { isFree: isFreeValue }),
                ...(req.query.difficulty_level && {
                    difficultyLevel: req.query.difficulty_level as string,
                }),
                ...(req.query.search && { search: req.query.search as string }),
                page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
            };

            const result = await this.courseService.getCourses(filters);

            logger.info(`Courses retrieved: ${result.courses.length} courses found`);

            res.status(200).json({
                success: true,
                message: 'Courses retrieved successfully',
                data: result.courses,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    };

    getCourseById = async (
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new Error('Course ID is required');
            }

            const course = await this.courseService.getCourseById(id);

            logger.info(`Course detail retrieved: ${course.title}`);

            res.status(200).json({
                success: true,
                message: 'Course details retrieved successfully',
                data: course,
            });
        } catch (error) {
            next(error);
        }
    };
}
