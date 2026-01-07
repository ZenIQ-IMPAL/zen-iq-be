import { Router } from 'express';
import { authenticateToken } from '../../auth/middlewares/auth.middleware';
import { LearningProgressController } from '../controllers/learning-progress.controller';

const router = Router();
const learningProgressController = new LearningProgressController();

router.get(
    '/me',
    authenticateToken,
    learningProgressController.getMyLearningProgress
);

export { router as learningProgressRoutes };
