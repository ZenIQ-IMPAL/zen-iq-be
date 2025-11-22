import { Router } from 'express';
import { SubscriptionPlansController } from '../controllers/subscription-plans.controller';
import { authenticateToken } from '../../auth/middlewares/auth.middleware';

const router = Router();
const controller = new SubscriptionPlansController();

router.get('/', authenticateToken, controller.getSubscriptionPlans);

export { router as subscriptionPlansRoutes };
