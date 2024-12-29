// Why a type instead of an enum?
export type TransactionType = 'deposit' | 'withdrawal'

// Why the I at the beginning?

export interface ITransaction {
    type: TransactionType;
    account: string;
    amount: number;
    date: Date;
}