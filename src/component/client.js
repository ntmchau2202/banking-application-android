// import profile, {command, status} from "../constant/env"

// import { BlockchainInteractor } from "../contract/contract"
// import { hexZeroPad, verifyMessage } from "ethers/lib/utils"
// import { Render } from "./render"

const profile = require("../constant/env").profile
const command = require("../constant/env").command
const status = require("../constant/env").status
const BlockchainInteractor = require("../contract/contract").BlockchainInteractor
const Render = require("./render").Render

const axios = require('axios').default
const ethers = require('ethers')

class Client {
    // const customer 
    // const clientInstannce = axios.create({
    //     baseURL: profile.baseUrl,
    //     timeout: profile.timeOut,
    //     headers: profile.headers
    // })

    // customer has client
    constructor() {
        // TODO: INIT THIS!
        const blockchainInteractor = null
        const httpClient = axios.create({
            baseURL: profile.baseUrl,
            timeout: profile.timeOut,
            headers: profile.headers
        })
        this.httpClient = httpClient
        this.blockchainInteractor = blockchainInteractor
    }

    #createMessage(command, details) {
        return JSON.stringify({
            "command": command,
            "details": details,
        })
    }

    #errorNotification(message, details) {
        return JSON.stringify({
            error: message,
            message: details,
        })
    }

    addWallet(privateKey) {
        const blockchainInteractor = new BlockchainInteractor(privateKey)
        this.blockchainInteractor = blockchainInteractor
    }

    // ok
    async login(phone, password) {
        let customerInfo = null
        try { 
            await this.httpClient.post('/account/login', this.#createMessage(command.login, {
                "customer_phone": phone,
                "password": password,
            })).then(function (response) {
                if (response.data.status === status.error) {
                    throw this.#errorNotification("login failed", err)
                } else {
                    customerInfo = Render.renderLoginInfo(response.data)
                    return customerInfo
                }
            }).catch(function (error) {
                console.log("Error when posting:", error)
                throw this.#errorNotification("unexpected error when logging in", error)
            })
        } catch (error) {
            console.log("Unexpected error:", error)
            throw this.#errorNotification("error logging in", error)
        }
        return customerInfo
    }

    async requestOpenAccount(txn) {
        const instance = this
        try {
            // step 1: connect to bank server
            var signedMsgFromBank = ""
            var txnHash = ""
            await this.httpClient.post("/savings/create", this.#createMessage(command.createAccount, txn))
            .then(function (response) {
                if (response.data.status === status.error) {
                    throw instance.#errorNotification("error creating account", error)
                } else {
                    // step 2: interact with the blockchain to save transaction
                    signedMsgFromBank = response.signed_message
                    txnHash = instance.blockchainInteractor.openTransaction(txn, signedMsgFromBank)
                }
            }).catch(function (error) {
                console.log(error)
                // throw this.#errorNotification("error creating account", error)
            })
            // step 3: sending back txnHash for confirmation
            this.httpClient.post("/savings/confirmation", this.#createMessage(command.confirm, {
                "txn_hash": txnHash,
                "savingsaccount_id": txn.savingsAccountID,
                "action": command.createAccount,
            }), {
                validateStatus: function (status) {
                    if (status != 204) {
                        throw this.#errorNotification("error sending back confirmation hash", error) 
                    } 
                    return
                }
            }).catch(function (error) {
                throw this.#errorNotification("error sending back confirmation hash", error)
            })
        } catch (error) {
            console.log(error)
            throw this.#errorNotification("error when open account", error)
        }
    }

    async requestSettleAccount(txn) {
        const instance = this
        try {
            // step 1: connect to bank server
            var signedMsgFromBank = ""
            await this.httpClient.post("/savings/settle", this.#createMessage(command.settleAccount, txn))
            .then(function (response) {
                if (response.data.status === status.error) {
                    throw this.#errorNotification("error settling account", error)
                } else {
                    // step 2: send transaction to get receipt on blockchain
                    signedMsgFromBank = response.signed_message
                    return instance.blockchainInteractor.settleTransaction(txn, signedMsgFromBank)
                }
            }).catch(function (error) {
                console.log(error)
                throw instance.#errorNotification("error settling account", error)
            })
            // step 3: sending back txnHash to bank server
            instance.httpClient.post("/savings/confirmation", instance.#createMessage(command.confirm, {
                "txn_hash": txnHash,
                "savingsaccount_id": txn.savingsAccountID,
                "action": command.settleAccount,
            }), {
                validateStatus: function (status) {
                    if (status != 204) {
                        throw instance.#errorNotification("error sending back confirmation hash", error) 
                    } 
                    return
                }
            }).catch(function (error) {
                throw instance.#errorNotification("error sending back confirmation hash", error)
            })
        } catch (error) {
            console.log(error)
            throw instance.#errorNotification("error when settle account", error)
        }
    }

    // ok
    async fetchInfo(phone) {
        let customerInfo = null
        try {
            await this.httpClient.post("/account/info", this.#createMessage(command.fetchInfo, {
                "customer_phone": phone,
            }))
            .then(function (response) {
                if (response.data.status === status.error) {
                    throw this.#errorNotification("fetch data failed", err)
                } else {
                    customerInfo = Render.renderLoginInfo(response.data)
                }
            }).catch(function (error) {
                console.log("Error when posting:", error)
                throw this.#errorNotification("unexpected error when logging in", error)
            })
        } catch (error) {
            console.log(error)
            throw this.#errorNotification("error querying account", error)
        }
        return customerInfo
    }
    
    fetchTransactionReceipt(txnHash) {
        try {
            let openTxns, settleTxns = this.blockchainInteractor.fetchTransactionsFromChain()
            // step 2: filter by txn
            
        } catch (error) {
            throw this.errorNotification("cannot fetch transactions", error)
        }
    }
}

module.exports.Client = Client



