import type { NextFunction, Response } from 'express';
import type { ApiResponse, AuthRequest } from '../../../shared/types';
import { logger } from '../../../shared/utils/logger';
import { RecommendationService } from '../services/recommendation.service';

export class RecommendationController {
    private recommendationService: RecommendationService;

    constructor() {
        this.recommendationService = new RecommendationService();
    }

    getRecommendedCourses = async (
        req: AuthRequest,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> => {
        try {
            // get userId from authenticated user
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                    data: [],
                });
                return;
            }

            const recommendedCourses = await this.recommendationService.getRecommendedCourses({
                userId,
            });

            logger.info(
                `Recommended courses retrieved: ${recommendedCourses.length} courses for user ${userId}`
            );

            res.status(200).json({
                success: true,
                message:
                    recommendedCourses.length > 0
                        ? 'Recommended courses retrieved'
                        : 'No recommendations available',
                data: recommendedCourses,
            });
        } catch (err) {
            logger.error('Error fetching recommended courses', err);
            next(err);
        }
    };
}
