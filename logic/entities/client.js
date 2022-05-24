// import profile, {command, status} from "../constant/env"

// import { BlockchainInteractor } from "../contract/contract"
// import { hexZeroPad, verifyMessage } from "ethers/lib/utils"
// import { Render } from "./render"

const profile = require("../constant/env").profile
const command = require("../constant/env").command
const status = require("../constant/env").status
const BlockchainInteractor = require("../contract/contract").BlockchainInteractor
const Render = require("./render").Render
// const fs = require('fs')

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
        const moralisClient = axios.create({
            baseURL: profile.moralisUrl,
            timeout: profile.timeOut,
            headers: profile.moralisHeaders,
        })
        this.httpClient = httpClient
        this.blockchainInteractor = blockchainInteractor
        this.moralisClient = moralisClient
    }

    createMessage(command, details) {
        return JSON.stringify({
            "command": command,
            "details": details,
        })
    }

    errorNotification(message, details) {
        return JSON.stringify({
            error: message,
            message: details,
        })
    }

    addWallet(privateKey) {
        const blockchainInteractor = new BlockchainInteractor(privateKey)
        this.blockchainInteractor = blockchainInteractor
    }

    async getTransactionDetailsByHash(type, hash) {
        const instance = this
        let information = null
        try {
            let uri = '/transaction/' + hash 
            console.log("uri:", uri)
            await this.moralisClient.get(uri, {
                params: {
                    chain: profile.defaultChain
                }
            }).then(function(response) {
                if(response.status === 200) {
                    let body = response.data.input
                    information = instance.blockchainInteractor.decodeInput(type, body)
                    return information
                } else {
                    console.log(response)
                    throw 'an error occured when fetching transaction details'
                }
            }).catch(function(error) {
                throw error
            })
        } catch(error) {
            console.log(error)
            throw error
        }   
        return information
    }

    // ok
    async login(phone, password) {
        const instance = this
        let customerInfo = null
        try { 
            await this.httpClient.post('/account/login', this.createMessage(command.login, {
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
            throw instance.errorNotification("error logging in", error)
        }
        return customerInfo
    }

    createOpenTransactionMessage(txn, id) {
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
            await this.httpClient.post("/savings/create", this.createMessage(command.createAccount, txn))
            .then(async function (response) {
                if (response.status === 200) {
                    try {
                        savingsAccountID = response.data.details.savingsaccount_id
                        signedMsgFromBank = response.data.details.signature
                        let clientMsg = instance.createOpenTransactionMessage(txn, savingsAccountID)
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
            await this.httpClient.post("/savings/confirmation", this.createMessage(command.confirm, {
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
            throw this.errorNotification("error when open account", error)
        }
    }

    createSettleTransactionMessage(txn) {
        return {
            "customer_phone": txn.customer_phone,
            "savingsaccount_id": txn.savingsaccount_id,
            "actual_interest_amount": txn.actual_interest_amount,
            "settle_time": txn.settle_time
        }
    }

    async verifySettlement(account) {
        const instance = this 
        // create message
        try {
            await this.httpClient.post("/savings/signature", this.createMessage(command.signature, {
                "customer_phone": profile.currentCustomer.phone,
                "savingsaccount_id": profile.currentWorkingSavingsAccount.savingsAccountID,
                "transaction_type": "settle",
            })).then(function(response){
                if(response.status === 200) {
                    let bankSig = response.data.details.signature 
                    console.log(account)
                    let message = {
                        "savingsaccount_id": account.savingsAccountID,
                        "actual_interest_amount": account.actualInterestAmount,
                        "settle_time": account.settleTime,
                    }
                    instance.blockchainInteractor.verifySignature(message, bankSig)
                        .then(function(result){
                            console.log("returned result:", result)
                            if (result[0] === true) {
                                // valid
                                console.warn("Information is valid")
                            } else {
                                // invalid
                                console.warn("Information mismatch. Please contact the bank for more information")
                            }
                        }).catch(function(error) {
                            throw error
                        })
                }
            }).catch(function(error){
                throw error
            })
        } catch(error) {
            throw error
        }
    }

    async isCustomerEnrolled(customerID) {
        const instance = this 
        console.log("in isCustomerEnrolled")
        var result = null
        try {
            console.log("Here we go again")
            result = await this.httpClient.post("/register/exist", this.createMessage(command.checkEnrollment, {
                "customer_id": customerID
            })).then(function(response){
                console.log("result:", response.data)
                return response.data.details.is_enrolled
            }).catch(function(error){
                console.log("error:", error)
                throw error
            })
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            return result
        }
    }

    async verifyCreation(account) {
        const instance = this 
        // create message
        try {
            await this.httpClient.post("/savings/signature", this.createMessage(command.signature, {
                "customer_phone": profile.currentCustomer.phone,
                "savingsaccount_id": profile.currentWorkingSavingsAccount.savingsAccountID,
                "transaction_type": "create"
            })).then(function(response){
                if(response.status === 200) {
                    let bankSig = response.data.details.signature 
                    console.log(account)
                    let message = {
                        "savingsaccount_id": account.savingsAccountID,
                        "product_type": account.savingsType,
                        "bankaccount_id": account.bankAccountID,
                        "savings_amount": account.savingsAmount,
                        "estimated_interest_amount": account.estimatedInterestAmount,
                        "open_time": account.openTime,
                        "savings_period": account.savingsPeriod,
                        "settle_instruction": account.settleInstruction,
                        "customer_id": profile.currentCustomer.customer_id,
                        "interest_rate": account.interestRate,
                        "currency": account.currency,
                    }
                    instance.blockchainInteractor.verifySignature(message, bankSig)
                        .then(function(result){
                            console.log("returned result:", result)
                            if (result[0] === true) {
                                // valid
                                console.warn("Information is valid")
                            } else {
                                // invalid
                                console.warn("Information mismatch. Please contact the bank for more information")
                            }
                        }).catch(function(error) {
                            throw error
                        })
                }
            }).catch(function(error){
                throw error
            })
        } catch(error) {
            throw error
        }
        
    }

    async requestSettleAccount(txn) {
        const instance = this
        var savingsAccountID = txn.savingsaccount_id
        var signedMsgFromBank = ""
        var txnHash = ""
        try {
            // step 1: connect to bank server
            await this.httpClient.post("/savings/settle", this.createMessage(command.settleAccount, txn))
            .then(async function (response) {
                if (response.status === 200) {
                    try {
                        signedMsgFromBank = response.data.details.signature
                        let clientMsg = instance.createSettleTransactionMessage(txn)
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
            await this.httpClient.post("/savings/confirmation", this.createMessage(command.confirm, {
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
            throw this.errorNotification("error when open account", error)
        }
    }

    // ok
    async fetchInfo(phone) {
        const instance = this
        let customerInfo = null
        try {
            await instance.httpClient.post("/account/info", this.createMessage(command.fetchInfo, {
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
            throw instance.errorNotification("error fetching customer data", error)
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

    async registerBlockchainReceiptService(customerID, customerAddress) {
        let result = null
        try {
            result = await this.httpClient.post("/register/blockchainReceiptService", this.createMessage(command.registerService, {
                "customer_id": customerID,
                "customer_address": customerAddress,
            })).then(function(response) {
                return response.data
            }).catch(function(error){
                throw error
            })
        } catch (error) {
            throw error
        }
        return result
    }
}

module.exports.Client = Client



