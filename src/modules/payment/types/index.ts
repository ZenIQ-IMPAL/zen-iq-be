export interface CreatePaymentRequest {
    subscriptionPlanId: string;
}

export interface PaymentResponse {
    orderId: string;
    snapToken: string;
    redirectUrl: string;
    amount: number;
    subscriptionPlanId: string;
}

export interface MidtransNotification {
    transactionTime: string;
    transactionStatus: string;
    transactionId: string;
    statusMessage: string;
    statusCode: string;
    signatureKey: string;
    settlementTime?: string;
    paymentType: string;
    orderId: string;
    merchantId: string;
    grossAmount: string;
    fraudStatus: string;
    currency?: string;
}

export interface SubscriptionStatus {
    isActive: boolean;
    subscriptionPlanId?: string | null;
    planName?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    status?: string | null;
}
