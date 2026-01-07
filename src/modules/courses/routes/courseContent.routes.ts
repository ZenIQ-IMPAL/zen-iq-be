import { Router } from 'express';
import { authenticateToken } from '../../auth/middlewares/auth.middleware';
import { CourseContentController } from '../controllers/courseContent.controller';

const router = Router();
const courseContentController = new CourseContentController();

router.patch(
    '/:id/check',
    authenticateToken,
    courseContentController.updateIsChecked
);

export { router as courseContentRoutes };
