export interface IAPIResponse<T> {
    status: number;
    data: T;
    error?: string;
}

export interface IBalanceResponse {
    balance: number;
    lastUpdated: Date;
}

export interface ITransactionResponse {
    success: boolean;
    transactionId: string;
    timestamp: Date;
}

export interface IVerifyCredentialsResponse {
    verified: boolean;
    sessionToken?: string;
}
