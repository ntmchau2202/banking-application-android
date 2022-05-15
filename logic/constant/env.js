const profile = {
    baseUrl: "http://localhost:9999/v1",
    timeOut: 10000,
    headers: {
        'Content-type': "application/json",
    },
    // bankPrivateKey: "0ae14037ea4665f2c0042a5d15ebf3b6510965c5da80be7c681412b271537b75", // ganache
    // customerPrivateKey: "37b435866589162c1945b62de3a8d43c7ef809d1f45e8814eeaa5ce1cbc3dcb8", // ganache
    bankPrivateKey: "7d0330973175291e2f52f4cb44572084e4580a7dbf00ba3c10ff463f1ad75e9e",
    customerPrivateKey: "7d0330973175291e2f52f4cb44572084e4580a7dbf00ba3c10ff463f1ad75e9e",
    // contractAddress: "0x1f1d37d21E096cE005Fd36351908d98a81D0Dd2E",
    // contractAddress: "0x0c937E987a97792535755BA277802DDDb45bbE65", // ganache
    contractAddress: "0x8eD119E25A00B4E0Ec58126DFE62F2bdd95D51B5",
    bankOwner: "0x0bCAeeacf54D193bbe514607B4e35f5830587bF8",
    // blockchainNode: "ws://127.0.0.1:8546",
    // blockchainNode: "http://127.0.0.1:8545",
    blockchainNode: "http://192.168.1.9:8545",
    currentCustomer: null,
    connector: null,
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