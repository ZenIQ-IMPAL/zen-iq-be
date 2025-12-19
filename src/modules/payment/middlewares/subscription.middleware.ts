import type { NextFunction, Response } from 'express';
import type { AuthRequest } from '../../../shared/types';
import { SubscriptionService } from '../services/subscription.service';

export const checkActiveSubscription = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const subscriptionService = new SubscriptionService();
        const subscriptionStatus = await subscriptionService.getSubscriptionStatus(req.user.id);

        if (!subscriptionStatus.isActive) {
            res.status(403).json({
                success: false,
                message: 'Active subscription required to access this resource',
            });
            return;
        }

        req.subscription = subscriptionStatus;

        next();
    } catch (error) {
        next(error);
    }
};
