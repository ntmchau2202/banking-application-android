const profile = {
    baseUrl: "http://localhost:9999/v1",
    timeOut: 10000,
    headers: {
        'Content-type': "application/json",
    },
    bankPrivateKey: "0ae14037ea4665f2c0042a5d15ebf3b6510965c5da80be7c681412b271537b75",
    customerPrivateKey: "37b435866589162c1945b62de3a8d43c7ef809d1f45e8814eeaa5ce1cbc3dcb8",
    // contractAddress: "0x1f1d37d21E096cE005Fd36351908d98a81D0Dd2E",
    contractAddress: "0x0c937E987a97792535755BA277802DDDb45bbE65",
    bankOwner: "0xfA64644Eb3dA2A95eea862eAD4a1132bECe4d63D",
    blockchainNode: "http://0.0.0.0:8545",
    currentCustomer: null,
}

const command = {
    login: "LOGIN",
    createAccount: "CREATE_ONLINE_SAVINGS_ACCOUNT",
    settleAccount: "SETTLE_ONLINE_SAVINGS_ACCOUNT",
    fetchInfo: "FETCH_LIST_SAVINGS_ACCOUNT",
    confirm: "CONFIRM_TRANSACTION"
}

const status = {
    success: "success",
    error: "error",
}

module.exports.status = status
module.exports.command = command
module.exports.profile = profile