import { and, eq, gte, lte } from 'drizzle-orm';
import { db } from '../../../config/database';
import { payments, subscriptionPlans, userSubscriptions } from '../../../database/schema';
import type { SubscriptionStatus } from '../types';

export class SubscriptionService {
    async activateSubscription(userId: string, paymentId: string): Promise<void> {
        const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId));

        if (!payment || !payment.subscriptionPlanId) {
            throw new Error('Payment or subscription plan not found');
        }

        const [plan] = await db
            .select()
            .from(subscriptionPlans)
            .where(eq(subscriptionPlans.id, payment.subscriptionPlanId));

        if (!plan) {
            throw new Error('Subscription plan not found');
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.durationMonths);

        await db
            .update(userSubscriptions)
            .set({
                status: 'expired',
                updatedAt: new Date(),
            })
            .where(
                and(eq(userSubscriptions.userId, userId), eq(userSubscriptions.status, 'active'))
            );

        await db.insert(userSubscriptions).values({
            userId,
            subscriptionPlanId: payment.subscriptionPlanId,
            paymentId,
            status: 'active',
            startDate,
            endDate,
        });
    }

    async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
        const now = new Date();

        const [subscription] = await db
            .select({
                id: userSubscriptions.id,
                status: userSubscriptions.status,
                startDate: userSubscriptions.startDate,
                endDate: userSubscriptions.endDate,
                subscriptionPlanId: userSubscriptions.subscriptionPlanId,
                planName: subscriptionPlans.planName,
            })
            .from(userSubscriptions)
            .leftJoin(
                subscriptionPlans,
                eq(userSubscriptions.subscriptionPlanId, subscriptionPlans.id)
            )
            .where(
                and(
                    eq(userSubscriptions.userId, userId),
                    eq(userSubscriptions.status, 'active'),
                    gte(userSubscriptions.endDate, now)
                )
            )
            .orderBy(userSubscriptions.endDate)
            .limit(1);

        if (!subscription) {
            return {
                isActive: false,
            };
        }

        return {
            isActive: true,
            subscriptionPlanId: subscription.subscriptionPlanId || null,
            planName: subscription.planName || null,
            startDate: subscription.startDate || null,
            endDate: subscription.endDate || null,
            status: subscription.status || null,
        };
    }

    async checkAndExpireSubscriptions(): Promise<void> {
        const now = new Date();

        await db
            .update(userSubscriptions)
            .set({
                status: 'expired',
                updatedAt: now,
            })
            .where(
                and(eq(userSubscriptions.status, 'active'), lte(userSubscriptions.endDate, now))
            );
    }

    async cancelSubscription(userId: string): Promise<void> {
        await db
            .update(userSubscriptions)
            .set({
                status: 'cancelled',
                updatedAt: new Date(),
            })
            .where(
                and(eq(userSubscriptions.userId, userId), eq(userSubscriptions.status, 'active'))
            );
    }

    async getUserSubscriptionHistory(userId: string): Promise<any[]> {
        const history = await db
            .select({
                id: userSubscriptions.id,
                status: userSubscriptions.status,
                startDate: userSubscriptions.startDate,
                endDate: userSubscriptions.endDate,
                createdAt: userSubscriptions.createdAt,
                planName: subscriptionPlans.planName,
                price: subscriptionPlans.price,
                durationMonths: subscriptionPlans.durationMonths,
            })
            .from(userSubscriptions)
            .leftJoin(
                subscriptionPlans,
                eq(userSubscriptions.subscriptionPlanId, subscriptionPlans.id)
            )
            .where(eq(userSubscriptions.userId, userId))
            .orderBy(userSubscriptions.createdAt);

        return history;
    }
}
