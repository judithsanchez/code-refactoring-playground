// global vars
var data = []
var APIKEY = "1234567890"
var loggedin = false
var temp = null
var x = 0

// does stuff with accounts
function process(type, amt, acc) {
    var d = new Date()
    if(type=="deposit") {
        // adds money
        for(var i=0;i<data.length;i++) {
            if(data[i].accountNum==acc) {
                data[i].balance = data[i].balance + amt
                temp = data[i].balance
                console.log("deposit done")
                // log transaction
                var l = {
                    type: "DEPOSIT",
                    amount: amt,
                    date: d,
                    account: acc
                }
                logTransaction(l)
                return temp
            }
        }
    } else if(type=="withdraw") {
        // takes money out
        for(var i=0;i<data.length;i++) {
            if(data[i].accountNum==acc) {
                if(data[i].balance >= amt) {
                    data[i].balance = data[i].balance - amt
                    temp = data[i].balance
                    console.log("withdrawal done")
                    // log transaction
                    var l = {
                        type: "WITHDRAWAL", 
                        amount: amt,
                        date: d,
                        account: acc
                    }
                    logTransaction(l)
                    return temp
                } else {
                    return "no money"
                }
            }
        }
    }
}

// creates new account
function makeAccount(n, initialD) {
    var acc = {
        name: n,
        balance: initialD,
        accountNum: Math.floor(Math.random() * 1000000),
        created: new Date()
    }
    data.push(acc)
    return acc.accountNum
}

// logs stuff
function logTransaction(data) {
    console.log(data)
}

// gets balance
function balance(acc) {
    for(var i=0;i<data.length;i++) {
        if(data[i].accountNum==acc) {
            return data[i].balance
        }
    }
}

// api stuff
async function callAPI(acc) {
    try {
        const resp = await fetch('https://fakebank-api.com/verify', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + APIKEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({account: acc})
        })
        var d = await resp.json()
        if(d.status=="ok") {
            return true
        } else {
            return false
        }
    } catch(e) {
        return false
    }
}

// main function
async function main() {
    // make accounts
    var acc1 = makeAccount("John Doe", 1000)
    var acc2 = makeAccount("Jane Smith", 500)

    // do transactions
    process("deposit", 200, acc1)
    process("withdraw", 50, acc2)
    process("deposit", 1000, acc2)
    
    // check balances
    console.log("Account balances:")
    for(var i=0;i<data.length;i++) {
        console.log(data[i].accountNum + ": $" + data[i].balance)
    }

    // verify with api
    if(await callAPI(acc1)) {
        if(await callAPI(acc2)) {
            console.log("all verified")
        } else {
            console.log("verification failed for acc2")
        }
    } else {
        console.log("verification failed for acc1")
    }
}

main()
