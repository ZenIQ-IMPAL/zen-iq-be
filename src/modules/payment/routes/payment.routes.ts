import { Router } from 'express';
import { authenticate } from '../../auth/middlewares/auth.middleware';
import { PaymentController } from '../controllers/payment.controller';

const router = Router();
const paymentController = new PaymentController();

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Create a new payment transaction
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription_plan_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/create', authenticate, paymentController.createPayment);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Handle Midtrans payment notification webhook
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Notification processed successfully
 */
router.post('/webhook', paymentController.handleWebhook);

/**
 * @swagger
 * /api/payments/status/{orderId}:
 *   get:
 *     summary: Get payment status by order ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/status/:orderId', authenticate, paymentController.getPaymentStatus);

/**
 * @swagger
 * /api/payments/my-payments:
 *   get:
 *     summary: Get current user's payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/my-payments', authenticate, paymentController.getMyPayments);

/**
 * @swagger
 * /api/payments/subscription/status:
 *   get:
 *     summary: Get current user's subscription status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/subscription/status', authenticate, paymentController.getSubscriptionStatus);

/**
 * @swagger
 * /api/payments/subscription/cancel:
 *   post:
 *     summary: Cancel current user's active subscription
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription cancelled successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/subscription/cancel', authenticate, paymentController.cancelSubscription);

/**
 * @swagger
 * /api/payments/subscription/history:
 *   get:
 *     summary: Get current user's subscription history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/subscription/history', authenticate, paymentController.getSubscriptionHistory);

export { router as paymentRoutes };
