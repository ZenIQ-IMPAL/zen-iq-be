import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../../../shared/types';
import { logger } from '../../../shared/utils/logger';
import { CourseContentService } from '../services/courseContent.service';

export class CourseContentController {
    private courseContentService: CourseContentService;

    constructor() {
        this.courseContentService = new CourseContentService();
    }

    // PATCH /api/course-content/:id/check
    updateIsChecked = async (
        req: Request,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { id } = req.params;
            const { isChecked } = req.body as { isChecked: boolean };

            if (!id) throw new Error('Content ID is required');

            const updated = await this.courseContentService.updateIsChecked(id, isChecked);

            logger.info(`Content ${id} is_checked updated to ${isChecked}`);

            res.status(200).json({
                success: true,
                message: 'Content checkbox updated successfully',
                data: updated,
            });
        } catch (error) {
            next(error);
        }
    };
}
