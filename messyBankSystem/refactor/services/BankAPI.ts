export class BankAPI {
    private static readonly API_URL = process.env.API_URL;
    private static readonly APIKEY = process.env.BANK_API_KEY;

    static async verifyCredentials(accountNum: string, userName: string, password: string): Promise<boolean> {
        const response = await fetch(`${this.API_URL}/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.APIKEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account: accountNum, userName, password })
        });

        return response.status === 200;
    }

    static async getBalance(accountNum: string): Promise<number> {
        const response = await fetch(`${this.API_URL}/balance/${accountNum}`, {
            headers: {
                'Authorization': `Bearer ${this.APIKEY}`
            }
        });
        
        const data = await response.json();
        return data.balance;
    }

    static async processTransaction(
        accountNum: string, 
        type: 'deposit' | 'withdrawal', 
        amount: number
    ): Promise<boolean> {
        const response = await fetch(`${this.API_URL}/transaction`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.APIKEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                account: accountNum, 
                type, 
                amount 
            })
        });

        return response.status === 200;
    }

    static async getTransactionHistory(accountNum: string): Promise<any[]> {
        const response = await fetch(`${this.API_URL}/transactions/${accountNum}`, {
            headers: {
                'Authorization': `Bearer ${this.APIKEY}`
            }
        });
        
        const data = await response.json();
        return data.transactions;
    }
}
