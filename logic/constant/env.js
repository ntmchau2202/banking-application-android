const profile = {
    baseUrl: "http://localhost:9999/v1",
    timeOut: 1000000,
    headers: {
        'Content-type': "application/json",
    },

    moralisHeaders: {
        'Content-type': "application/json",
        'accept': "application/json",
        'X-API-Key': "1u1Pz8EYYUEneV0ot5S9IzK9LmHzZeBlqr7DSGdf31bBq0NpI2nHJDuXiTJkfUR0",
    },
    defaultChain: 'mumbai',
    // bankPrivateKey: "0ae14037ea4665f2c0042a5d15ebf3b6510965c5da80be7c681412b271537b75", // ganache
    // customerPrivateKey: "37b435866589162c1945b62de3a8d43c7ef809d1f45e8814eeaa5ce1cbc3dcb8", // ganache
    // bankPrivateKey: "7d0330973175291e2f52f4cb44572084e4580a7dbf00ba3c10ff463f1ad75e9e",
    customerPrivateKey: "7d0330973175291e2f52f4cb44572084e4580a7dbf00ba3c10ff463f1ad75e9e",
    // contractAddress: "0x0c937E987a97792535755BA277802DDDb45bbE65", // ganache
    contractAddress: "0xcD03379581B202E6Fc0ae482A50A49aB07Cb63fA",
    bankOwner: "0x6d3951c9A9d34D2a59849AD0fe6fdBCEf4874149",
    blockchainNode: "http://192.168.1.9:8545",
    currentCustomer: null,
    connector: null,
    currentWorkingSavingsAccount: null,
    ipfsPublicNode: "https://gateway.moralisipfs.com/ipfs/",
    bankPublicKey: "",

    ipfsMiddleware: "http://localhost:9997/v1"
}

const command = {
    login: "LOGIN",
    createAccount: "CREATE_ONLINE_SAVINGS_ACCOUNT",
    settleAccount: "SETTLE_ONLINE_SAVINGS_ACCOUNT",
    fetchInfo: "FETCH_LIST_SAVINGS_ACCOUNT",
    confirm: "CONFIRM_TRANSACTION",
    signature: "REQUEST_SIGNATURE",
    registerService: "REGISTER_BLOCKCHAIN_RECEIPT_SERVICE",
    checkEnrollment: "CHECK_ENROLLMENT",
    deactivate: "DEACTIVATE"
}

const status = {
    success: "success",
    error: "error",
}

module.exports.status = status
module.exports.command = command
module.exports.profile = profile