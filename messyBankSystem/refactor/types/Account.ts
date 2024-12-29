import { ITransaction } from "./Transactions";

// I am using the I since we have a class Account and also an interface Account
export interface IAccount {
    userName: string;
    id: string;
    balance: number;
    transactions: ITransaction[];
    session: boolean;
}

export interface IAccountCredentials {
    userName: string;
    password: string;
    accountNum: string;
}
