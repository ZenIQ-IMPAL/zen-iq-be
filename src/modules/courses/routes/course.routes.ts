import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { validateGetCourseList, validateGetCourseById } from '../validators/course.validator';
import { authenticateToken } from '../../auth/middlewares/auth.middleware';

const router = Router();
const courseController = new CourseController();

router.get('/', authenticateToken, validateGetCourseList, courseController.getCourses);
router.get('/:id', authenticateToken, validateGetCourseById, courseController.getCourseById);

export { router as courseRoutes };
