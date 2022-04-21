export function GetUserTransaction(phone) {
    try {
        const result = await fetch(
            "http://localhost:9999", {
                "command": "FETCH_LIST_TRANSACTIONS", 
                "details": {
                    "customer_phone": phone,
                },
            })
        const response = await result.wait()
        const statusCode = response.status
        const body = response.json()
        if (statusCode === 200 ){
            // parse body here
        } else {
            // return errors here
        }
    } catch (err) {
        console.log(err)
    }
}

export function ConfirmTransaction(transaction) {
    // TODO: sign transaction and CONNECT IMMEDIATELY TO THE CONTRACT WITHOUT NOTIFYING THE SERVER
    // THE SERVER MUST FETCH INFORMATION VIA SUBCRIBER
}

export function DeclineTransaction(transaction) {
    // just drop transaction
}

export function SearchTransactionBySavingsAccount(savingsAccountID) {
    // CONNECT TO THE CONTRACT IMMEDIATELLY
}