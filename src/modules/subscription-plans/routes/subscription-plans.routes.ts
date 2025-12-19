import { Router } from 'express';
import { authenticateToken } from '../../auth/middlewares/auth.middleware';
import { SubscriptionPlansController } from '../controllers/subscription-plans.controller';

const router = Router();
const controller = new SubscriptionPlansController();

router.get('/', authenticateToken, controller.getSubscriptionPlans);

export { router as subscriptionPlansRoutes };
