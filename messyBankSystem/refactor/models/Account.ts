import { Transaction } from './Transaction';
import { BankAPI } from '../services/BankAPI';
import { TransactionType } from '../types/Transaction';

export class Account {
    private balance: number = 0;
    private transactions: Transaction[] = [];
    private session: boolean = false;
    private readonly id: string;

    constructor(
        private readonly userName: string,
        private readonly password: string
    ) {
        this.id = this.generateUniqueId();
    }

    private generateUniqueId(): string {
        return `ACC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private checkSession(): void {
        if (!this.session) {
            throw new Error('User must be logged in to perform transactions');
        }
    }

    async login(userName: string, password: string, accountNum: string): Promise<void> {
        const isVerified = await BankAPI.verifyCredentials(accountNum, userName, password);
        
        if (!isVerified) {
            throw new Error('Wrong credentials');
        }
        
        this.session = true;
    }

    logout(): void {
        this.session = false;
    }

    deposit(amount: number): void {
        this.checkSession();
        
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            throw new Error('Invalid amount for deposit');
        }

        this.balance += amount;
        this.transactions.push(new Transaction('deposit', this.id, amount));
    }

    withdrawal(amount: number): void {
        this.checkSession();
        
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            throw new Error('Invalid amount for withdrawal');
        }

        if (amount > this.balance) {
            throw new Error('Insufficient funds');
        }

        this.balance -= amount;
        this.transactions.push(new Transaction('withdrawal', this.id, amount));
    }

    getBalance(): number {
        this.checkSession();
        return this.balance;
    }

    getTransactionHistory(): Transaction[] {
        this.checkSession();
        return [...this.transactions];
    }
}
