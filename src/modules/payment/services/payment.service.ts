import crypto from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '../../../config/database';
import { env } from '../../../config/env';
import { coreApi, snap } from '../../../config/midtrans';
import { paymentGateway, payments, subscriptionPlans } from '../../../database/schema';
import type { CreatePaymentRequest, MidtransNotification, PaymentResponse } from '../types';
import { SubscriptionService } from './subscription.service';

export class PaymentService {
    private subscriptionService: SubscriptionService;

    constructor() {
        this.subscriptionService = new SubscriptionService();
    }
    async createPayment(userId: string, data: CreatePaymentRequest): Promise<PaymentResponse> {
        const [plan] = await db
            .select()
            .from(subscriptionPlans)
            .where(eq(subscriptionPlans.id, data.subscriptionPlanId));

        if (!plan) {
            throw new Error('Subscription plan not found');
        }

        const orderId = `ORDER-${Date.now()}-${userId.substring(0, 8)}`;
        const amount = Number(plan.price);

        await db
            .insert(payments)
            .values({
                userId,
                subscriptionPlanId: data.subscriptionPlanId,
                orderId,
                amount: plan.price,
                paymentStatus: 'pending',
            })
            .returning();

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount,
            },
            customer_details: {
                first_name: 'User',
            },
            item_details: [
                {
                    id: plan.id,
                    price: amount,
                    quantity: 1,
                    name: `${plan.planName} Subscription`,
                },
            ],
            callbacks: {
                finish: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
                error: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/error`,
                pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/pending`,
            },
        };

        const transaction = await snap.createTransaction(parameter);

        await db.insert(paymentGateway).values({
            gatewayName: 'midtrans',
            transactionId: transaction.transaction_id,
            snapToken: transaction.token,
            gatewayResponse: JSON.stringify(transaction),
        });

        await db
            .update(payments)
            .set({
                gatewayId: (
                    await db
                        .select()
                        .from(paymentGateway)
                        .where(eq(paymentGateway.snapToken, transaction.token))
                        .limit(1)
                )[0]?.id,
            })
            .where(eq(payments.orderId, orderId));

        return {
            orderId,
            snapToken: transaction.token,
            redirectUrl: transaction.redirect_url,
            amount,
            subscriptionPlanId: data.subscriptionPlanId,
        };
    }

    async handleNotification(notification: MidtransNotification): Promise<void> {
        const orderId = notification.orderId;
        const transactionStatus = notification.transactionStatus;
        const fraudStatus = notification.fraudStatus;

        const serverKey = env.MIDTRANS_SERVER_KEY;
        const hash = crypto
            .createHash('sha512')
            .update(`${orderId}${notification.statusCode}${notification.grossAmount}${serverKey}`)
            .digest('hex');

        if (hash !== notification.signatureKey) {
            throw new Error('Invalid signature key');
        }

        const [payment] = await db.select().from(payments).where(eq(payments.orderId, orderId));

        if (!payment) {
            throw new Error('Payment not found');
        }

        const paymentStatus = this.determinePaymentStatus(transactionStatus, fraudStatus);

        await db
            .update(payments)
            .set({
                paymentStatus,
                paymentMethod: notification.paymentType,
                updatedAt: new Date(),
            })
            .where(eq(payments.orderId, orderId));

        if (paymentStatus === 'success') {
            await this.subscriptionService.activateSubscription(payment.userId, payment.id);
        }
    }

    private determinePaymentStatus(transactionStatus: string, fraudStatus: string): string {
        const statusMap: Record<string, string> = {
            settlement: 'success',
            pending: 'pending',
            cancel: 'failed',
            deny: 'failed',
            expire: 'failed',
        };

        if (transactionStatus === 'capture') {
            return fraudStatus === 'accept' ? 'success' : 'pending';
        }

        return statusMap[transactionStatus] || 'pending';
    }

    async getPaymentStatus(orderId: string): Promise<any> {
        const status = await coreApi.transaction.status(orderId);
        return status;
    }

    async getUserPayments(userId: string): Promise<any[]> {
        const userPayments = await db
            .select({
                id: payments.id,
                orderId: payments.orderId,
                amount: payments.amount,
                paymentStatus: payments.paymentStatus,
                paymentMethod: payments.paymentMethod,
                createdAt: payments.createdAt,
                subscriptionPlanId: payments.subscriptionPlanId,
                planName: subscriptionPlans.planName,
            })
            .from(payments)
            .leftJoin(subscriptionPlans, eq(payments.subscriptionPlanId, subscriptionPlans.id))
            .where(eq(payments.userId, userId))
            .orderBy(payments.createdAt);

        return userPayments;
    }
}
