import { Router } from 'express';
import { authenticateToken } from '../../auth/middlewares/auth.middleware';
import { CourseController } from '../controllers/course.controller';
import { validateGetCourseById, validateGetCourseList } from '../validators/course.validator';

const router = Router();
const courseController = new CourseController();

router.get('/', authenticateToken, validateGetCourseList, courseController.getCourses);
router.get('/:id', authenticateToken, validateGetCourseById, courseController.getCourseById);

export { router as courseRoutes };
