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
        const blockchainInteractor = new BlockchainInteractor(profile.customerPrivateKey)
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
        const instance = this
        let customerInfo = null
        try { 
            await this.httpClient.post('/account/login', this.#createMessage(command.login, {
                "customer_phone": phone,
                "password": password,
            })).then(function (response) {
                if (response.status === 200) {
                    try {
                        customerInfo = Render.renderLoginInfo(response.data)
                        return customerInfo
                    } catch (error) {
                        throw "error rendering customer info: " + error
                    }
                } else {
                    console.log("error message:", response.data.details.message)
                    throw response.data.details.message
                }
            }).catch(function (error) {
                if (error.hasOwnProperty('response')) {
                    throw error.response.data.details.message
                } else {
                    throw error
                }
            })
        } catch (error) {
            throw instance.#errorNotification("error logging in", error)
        }
        return customerInfo
    }

    #createOpenTransactionMessage(txn, id) {
        return {
            "savingsaccount_id": id,
            "product_type": txn.product_type,
            "bankaccount_id": txn.bankaccount_id,
            "savings_amount": txn.savings_amount,
            "estimated_interest_amount": txn.estimated_interest_amount,
            "open_time": txn.open_time,
            "savings_period": txn.savings_period,
            "settle_instruction": txn.settle_instruction,
            "customer_id": txn.customer_id,
            "interest_rate": txn.interest_rate,
            "currency": txn.currency,
        }
    }

    async requestOpenAccount(txn) {
        const instance = this
        var savingsAccountID = ""
        var signedMsgFromBank = ""
        var txnHash = ""
        try {
            // step 1: connect to bank server
            await this.httpClient.post("/savings/create", this.#createMessage(command.createAccount, txn))
            .then(async function (response) {
                if (response.status === 200) {
                    try {
                        savingsAccountID = response.data.details.savingsaccount_id
                        signedMsgFromBank = response.data.details.signature
                        let clientMsg = instance.#createOpenTransactionMessage(txn, savingsAccountID)
                        console.log("clientMsg:", clientMsg)
                        txnHash = await instance.blockchainInteractor.openTransaction(clientMsg, signedMsgFromBank)
                        console.log("Returned txnHash:", txnHash)
                    } catch (error) {
                        throw "error creating transaction on blockchain: " + error
                    }
                } else {
                    throw response.data.details.message
                }
            }).catch(function (error) {
                if (error.hasOwnProperty('response')) {
                    throw error.response.data.details.message
                } else {
                    throw error
                }
            })
            // step 3: sending back txnHash for confirmation
            await this.httpClient.post("/savings/confirmation", this.#createMessage(command.confirm, {
                "txn_hash": txnHash,
                "savingsaccount_id": savingsAccountID,
                "action": command.createAccount,
            })).then(function (response) {
                if (response.status != 204) {
                    throw "error sending back confirmation hash: " + response.data
                }
            }).catch(function (error) {
                throw error
            })
        } catch (error) {
            console.log(error)
            throw this.#errorNotification("error when open account", error)
        }
    }

    #createSettleTransactionMessage(txn) {
        return {
            "customer_phone": txn.customer_phone,
            "savingsaccount_id": txn.savingsaccount_id,
            "actual_interest_amount": txn.actual_interest_amount,
            "settle_time": txn.settle_time
        }
    }

    async requestSettleAccount(txn) {
        const instance = this
        var savingsAccountID = txn.savingsaccount_id
        var signedMsgFromBank = ""
        var txnHash = ""
        try {
            // step 1: connect to bank server
            await this.httpClient.post("/savings/settle", this.#createMessage(command.settleAccount, txn))
            .then(async function (response) {
                if (response.status === 200) {
                    try {
                        signedMsgFromBank = response.data.details.signature
                        let clientMsg = instance.#createSettleTransactionMessage(txn)
                        txnHash = await instance.blockchainInteractor.settleTransaction(clientMsg, signedMsgFromBank)
                        console.log("Returned txnHash:", txnHash)
                    } catch (error) {
                        throw "error creating transaction on blockchain: " + error
                    }
                } else {
                    throw response.data.details.message
                }
            }).catch(function (error) {
                if (error.hasOwnProperty('response')) {
                    throw error.response.data.details.message
                } else {
                    throw error
                }
            })
            // step 3: sending back txnHash for confirmation
            await this.httpClient.post("/savings/confirmation", this.#createMessage(command.confirm, {
                "txn_hash": txnHash,
                "savingsaccount_id": savingsAccountID,
                "action": command.settleAccount,
            })).then(function (response) {
                if (response.status != 204) {
                    throw "error sending back confirmation hash: " + response.data
                }
            }).catch(function (error) {
                throw error
            })
        } catch (error) {
            console.log(error)
            throw this.#errorNotification("error when open account", error)
        }
    }

    // ok
    async fetchInfo(phone) {
        const instance = this
        let customerInfo = null
        try {
            await instance.httpClient.post("/account/info", this.#createMessage(command.fetchInfo, {
                "customer_phone": phone,
            })).then(function (response) {
                if (response.status === 200) {
                    try {
                        customerInfo = Render.renderLoginInfo(response.data)
                        return customerInfo
                    } catch (error) {
                        throw "error rendering customer info: " + error
                    }
                } else {
                    console.log("error message:", response.data.details.message)
                    throw response.data.details.message
                }
            }).catch(function (error) {
                if (error.hasOwnProperty('response')) {
                    throw error.response.data.details.message
                } else {
                    throw error
                }
            })
        } catch (error) {
            throw instance.#errorNotification("error fetching customer data", error)
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



