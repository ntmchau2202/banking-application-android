const { default: axios } = require("axios");

const Client = require("./src/component/client").Client;
// import Client from "./src/component/client"

// const Client = require('./src/component/client')

const privateKey = Buffer.from(
    '7d0330973175291e2f52f4cb44572084e4580a7dbf00ba3c10ff463f1ad75e9e',
    'hex',
)

async function main() {
    let client = new Client()
    // client.addWallet(privateKey)
        try {
            let promise = await client.requestOpenAccount({
                "customer_id": "N-0002",
                "customer_phone": "0123456789",
                "bankaccount_id": "A123",
                "product_type": "Online",
                "savings_period": 6,
                "interest_rate": 6.9,
                "savings_amount": 1000000,
                "estimated_interest_amount": 100000,
                "settle_instruction": "SETTLE_ALL",
                "currency": "VND",
                "open_time": "Sun, 03 Apr 2022 16:50:44 +07",
            })
            // console.log(promise.bankAccounts)
            console.log(promise)

        } catch (error) {
            console.log("An error occured:", error)
        }
}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
);