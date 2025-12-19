import type { NextFunction, Response } from 'express';
import type { ApiResponse, AuthRequest } from '../../../shared/types';
import { logger } from '../../../shared/utils/logger';
import { PaymentService } from '../services/payment.service';
import { SubscriptionService } from '../services/subscription.service';
import type { CreatePaymentRequest, MidtransNotification } from '../types';

export class PaymentController {
    private paymentService: PaymentService;
    private subscriptionService: SubscriptionService;

    constructor() {
        this.paymentService = new PaymentService();
        this.subscriptionService = new SubscriptionService();
    }

    createPayment = async (
        req: AuthRequest,
        res: Response<ApiResponse>,
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

            const data: CreatePaymentRequest = req.body;
            const result = await this.paymentService.createPayment(req.user.id, data);

            logger.info(`Payment created for user ${req.user.id}: ${result.orderId}`);

            res.status(201).json({
                success: true,
                message: 'Payment created successfully',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    handleWebhook = async (
        req: AuthRequest,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const notification: MidtransNotification = req.body;

            logger.info(`Webhook received for order: ${notification.orderId}`);

            await this.paymentService.handleNotification(notification);

            res.status(200).json({
                success: true,
                message: 'Notification processed successfully',
            });
        } catch (error) {
            logger.error('Webhook processing error:', error);
            next(error);
        }
    };

    getPaymentStatus = async (
        req: AuthRequest,
        res: Response<ApiResponse>,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { orderId } = req.params;

            if (!orderId) {
                res.status(400).json({
                    success: false,
                    message: 'Order ID is required',
                });
                return;
            }

            const status = await this.paymentService.getPaymentStatus(orderId);

            res.status(200).json({
                success: true,
                message: 'Payment status retrieved successfully',
                data: status,
            });
        } catch (error) {
            next(error);
        }
    };

    getMyPayments = async (
        req: AuthRequest,
        res: Response<ApiResponse>,
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

            const payments = await this.paymentService.getUserPayments(req.user.id);

            res.status(200).json({
                success: true,
                message: 'Payment history retrieved successfully',
                data: payments,
            });
        } catch (error) {
            next(error);
        }
    };

    getSubscriptionStatus = async (
        req: AuthRequest,
        res: Response<ApiResponse>,
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

            const status = await this.subscriptionService.getSubscriptionStatus(req.user.id);

            res.status(200).json({
                success: true,
                message: 'Subscription status retrieved successfully',
                data: status,
            });
        } catch (error) {
            next(error);
        }
    };

    cancelSubscription = async (
        req: AuthRequest,
        res: Response<ApiResponse>,
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

            await this.subscriptionService.cancelSubscription(req.user.id);

            logger.info(`Subscription cancelled for user ${req.user.id}`);

            res.status(200).json({
                success: true,
                message: 'Subscription cancelled successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    getSubscriptionHistory = async (
        req: AuthRequest,
        res: Response<ApiResponse>,
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

            const history = await this.subscriptionService.getUserSubscriptionHistory(req.user.id);

            res.status(200).json({
                success: true,
                message: 'Subscription history retrieved successfully',
                data: history,
            });
        } catch (error) {
            next(error);
        }
    };
}
