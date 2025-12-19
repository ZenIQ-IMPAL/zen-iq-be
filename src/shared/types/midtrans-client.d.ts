declare module 'midtrans-client' {
    export interface MidtransConfig {
        isProduction: boolean;
        serverKey: string;
        clientKey: string;
    }

    export interface TransactionDetails {
        order_id: string;
        gross_amount: number;
    }

    export interface ItemDetails {
        id: string;
        price: number;
        quantity: number;
        name: string;
    }

    export interface CustomerDetails {
        first_name: string;
        last_name?: string;
        email?: string;
        phone?: string;
    }

    export interface Callbacks {
        finish?: string;
        error?: string;
        pending?: string;
    }

    export interface TransactionParameter {
        transaction_details: TransactionDetails;
        customer_details?: CustomerDetails;
        item_details?: ItemDetails[];
        callbacks?: Callbacks;
    }

    export interface SnapResponse {
        token: string;
        redirect_url: string;
        transaction_id?: string;
    }

    export class Snap {
        constructor(config: MidtransConfig);
        createTransaction(parameter: TransactionParameter): Promise<SnapResponse>;
    }

    export class CoreApi {
        constructor(config: MidtransConfig);
        transaction: {
            status(orderId: string): Promise<any>;
            cancel(orderId: string): Promise<any>;
            approve(orderId: string): Promise<any>;
        };
    }
}
