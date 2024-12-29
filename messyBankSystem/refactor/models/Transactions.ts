import { ITransaction, TransactionType } from "../types/types";

export class Transaction implements ITransaction {
    readonly date: Date;

    constructor(
        readonly type: TransactionType,
        readonly account: string,
        readonly amount: number
    ) {
        this.date = new Date();
    }
}
