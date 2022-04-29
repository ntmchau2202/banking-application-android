const profile = {
    baseUrl: "http://localhost:9999/v1",
    // baseUrl: "https://eo92aqz3qviqf4e.m.pipedream.net",
    timeOut: 10000,
    headers: {

    },
    contractAddress: "0x12345",
    bankWalletAddress: "0xabcd",
    blockchainNode: "wss:abcd"
}

const command = {
    login: "LOGIN",
    createAccount: "CREATE_ONLINE_SAVINGS_ACCOUNT",
    settleAccount: "SETTLE_ONLINE_SAVINGS_ACCOUNT",
    fetchInfo: "FETCH_LIST_SAVINGS_ACCOUNT",
    confirm: "CONFIRM_RECEIPT"
}

const status = {
    success: "success",
    error: "error",
}

module.exports.status = status
module.exports.command = command
module.exports.profile = profile