import type { NextFunction, Response } from 'express';
import type { ApiResponse } from '../../../shared/types';
import { logger } from '../../../shared/utils/logger';
import { LearningProgressService } from '../services/learning-progress.service';
import type { AuthRequest } from '../../../shared/types';

export class LearningProgressController {
    private learningProgressService: LearningProgressService;

    constructor() {
        this.learningProgressService = new LearningProgressService();
    }

    getMyLearningProgress = async (
        req: AuthRequest,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                throw new Error('User not authenticated');
            }

            const progress = await this.learningProgressService.getUserLearningProgress(
                userId
            );

            logger.info(
                `Learning progress retrieved: ${progress.length} courses found`
            );

            res.status(200).json({
                success: true,
                message: 'Learning progress retrieved successfully',
                data: progress,
            });
        } catch (error) {
            next(error);
        }
    };
}
