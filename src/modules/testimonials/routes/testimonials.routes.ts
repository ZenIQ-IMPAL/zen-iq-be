import { Router } from 'express';
import { TestimonialsController } from '../controllers/testimonials.controller';
import { validateGetTestimonials } from '../validators/testimonials.validator';

const router = Router();
const controller = new TestimonialsController();

router.get('/', validateGetTestimonials, controller.getTestimonials);

export { router as testimonialsRoutes };
