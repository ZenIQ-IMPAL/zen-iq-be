import { db } from '../../../config/database';
import { subscriptionPlans } from '../../../database/schema';
import type { SubscriptionPlan } from '../../../database/schema';

export class SubscriptionPlansService {
	async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
		const plans = await db.select().from(subscriptionPlans);

		return plans.map((plan) => ({
			...plan,
			features:
				typeof plan.features === 'string'
					? JSON.parse(plan.features)
					: plan.features,
		}));
	}
}
