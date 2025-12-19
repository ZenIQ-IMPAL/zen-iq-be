import { config } from 'dotenv';
import { db } from '../../config/database';
import { logger } from '../../shared/utils/logger';
import { subscriptionPlans } from '../schema';

config();

export async function seedSubscriptionPlans() {
    try {
        logger.info('Starting subscription plans seeding...');

        const plansData = [
            {
                planName: 'Monthly Plan',
                price: '99000.00',
                durationMonths: 1,
                features: JSON.stringify([
                    'Full access to all courses',
                    'Personalized learning paths',
                    'Cancel anytime',
                ]),
            },
            {
                planName: '6 Month Plan',
                price: '249000.00',
                durationMonths: 6,
                features: JSON.stringify([
                    'Everything in Monthly',
                    'Downloadable resources',
                    'Early access to new features',
                ]),
            },
            {
                planName: '12 Month Plan',
                price: '799000.00',
                durationMonths: 12,
                features: JSON.stringify([
                    'All features unlocked',
                    '1-on-1 mentoring',
                    'Premium certificate badges',
                ]),
            },
        ];

        const createdPlans = [];
        for (const planData of plansData) {
            try {
                const [plan] = await db.insert(subscriptionPlans).values(planData).returning();
                createdPlans.push(plan);
                logger.success(`Created subscription plan: ${planData.planName}`);
            } catch (error: any) {
                logger.error(`Failed to create plan ${planData.planName}:`, error);
            }
        }

        logger.success('Subscription plans seeding completed!');
        return createdPlans;
    } catch (error) {
        logger.error('Error seeding subscription plans:', error);
        throw error;
    }
}
