// The functionality of creating an account should belong to the Account class or to the Bank Class?
// How could I decide the structure of the properties of the new instance?
class Transaction {
    constructor (type, account, amount) {
        this.type = type;
        this.account = account;
        this.amount = amount
    }
    date = new Date();
}


class Account  {
    constructor(userName, password) {
        this.userName = userName
        this.password = password
    }

    balance = 0;
    transactions = []
    id= '12345' // TODO: create logic for unique identifier
    session= false;

    async login (userName, password, accountNum) {
        try {
            const res = await fetch('https://fakebank-api.com/verify', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + APIKEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({account: accountNum, password: password, userName: userName})
            })

            if (res.status === 200 ) {
                this.session = true;
            }
        } catch(e) {
            throw new Error ('Wrong credentials')
        }
    };

    logout () {
        this.session = false;
    }

    checkSession () {
        if (!this.session) {
            throw new Error ('User must be logged in to perform deposit transactions');
        }
    };

    deposit (amount) {
        this.checkSession();

        if (!amount || typeof(amount) !== Number) {
            throw new Error('Unable to perform transaction');
        }

        this.balance = this.balance + amount;

        this.transactions.push(new Transaction('deposit', this.account, amount));

    };

    withdrawl (amount) {
        this.checkSession();

        if (!amount || typeof(amount) !== Number) {
            throw new Error('Unable to perform transaction');
        }

        if (amount < this.balance) {
            this.balance = this.balance - amount;
        }

        this.transactions.push(new Transaction('withdrawl', this.account, amount));


    };

    getBalance () {
        this.checkSession();
        return this.balance;
    }

}



