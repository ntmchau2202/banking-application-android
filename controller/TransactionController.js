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

}

export function DeclineTransaction(transaction) {

}

export function SearchTransactionBySavingsAccount(savingsAccountID) {

}