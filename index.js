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
        // try {
            // let promise = await client.requestSettleAccount({
            //     "customer_phone": "01234567980",
            //     "savingsaccount_id": "1",
            //     "settle_time": "Mon, 04 Apr 2022 16:50:44 +07",
            //     "actual_interest_amount": 100000,

            // })
            // // console.log(promise.bankAccounts)
            // console.log(promise)

        //     let promise = await client.requestOpenAccount({
        //         "customer_phone": "0123456789",
        //         "bankaccount_id": "A123",
        //         "product_type": "Online",
        //         "savings_period": 6,
        //         "interest_rate": 6.9,
        //         "savings_amount": 1000000,
        //         "estimated_interest_amount": 100000,
        //         "settle_instruction": "SETTLE_ALL",
        //         "customer_id": "N-0002",
        //         "currency": "VND",
        //         "open_time": "Sun, 03 Apr 2022 16:50:44 +07",
        //     })

        // } catch (error) {
        //     console.log("An error occured:", error)
        // }
        
        // let promise = await client.fetchInfo("0123456789")
        // console.log(promise)

        let promise = await client.login("0335909144", "12345")
        console.log(promise)
}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
);