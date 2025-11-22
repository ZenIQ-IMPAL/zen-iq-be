import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../../../shared/types';
import { SubscriptionPlansService } from '../services/subscription-plans.service';

export class SubscriptionPlansController {
	private subscriptionPlansService: SubscriptionPlansService;

	constructor() {
		this.subscriptionPlansService = new SubscriptionPlansService();
	}

	getSubscriptionPlans = async (
		_req: Request,
		res: Response<ApiResponse>,
		next: NextFunction,
	): Promise<void> => {
		try {
			const plans =
				await this.subscriptionPlansService.getSubscriptionPlans();

			res.status(200).json({
				success: true,
				message: 'Subscription plans retrieved successfully',
				data: plans,
			});
		} catch (error) {
			next(error);
		}
	};
}
