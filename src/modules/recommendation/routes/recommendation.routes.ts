import { Router } from 'express';
import { authenticateToken } from '../../auth/middlewares/auth.middleware';
import { RecommendationController } from '../controllers/recommendation.controller';

const router = Router();
const recommendationController = new RecommendationController();

router.get('/', authenticateToken, recommendationController.getRecommendedCourses);

export { router as recommendationRoutes };
