import cron from 'node-cron';
import { SubscriptionService } from '../../modules/payment/services/subscription.service';
import { logger } from '../utils/logger';

const subscriptionService = new SubscriptionService();

// Run every day at midnight (00:00)
export const subscriptionExpiryCron = cron.schedule(
    '0 0 * * *',
    async () => {
        try {
            logger.info('Running subscription expiry check...');
            await subscriptionService.checkAndExpireSubscriptions();
            logger.info('Subscription expiry check completed successfully');
        } catch (error) {
            logger.error('Error running subscription expiry check:', error);
        }
    },
    {
        timezone: 'Asia/Jakarta',
    }
);

export const startSubscriptionExpiryCron = () => {
    subscriptionExpiryCron.start();
    logger.info('Subscription expiry cron job started');
};

export const stopSubscriptionExpiryCron = () => {
    subscriptionExpiryCron.stop();
    logger.info('Subscription expiry cron job stopped');
};
