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
const fetch = require('node-fetch')
const axios = require('axios').default
const ethers = require('ethers')
const { default: CryptoES } = require("crypto-es")
import * as FileSystem from 'expo-file-system'
import { RSA, Crypt} from 'hybrid-crypto-js'

class Client {
    // const customer 
    // const clientInstannce = axios.create({
    //     baseURL: profile.baseUrl,
    //     timeout: profile.timeOut,
    //     headers: profile.headers
    // })

    // customer has client
    // componentWillMount() {
    //     nodejs.start('main.js')
    // }

    constructor() {
        const blockchainInteractor = new BlockchainInteractor(profile.customerPrivateKey)
        const httpClient = axios.create({
            baseURL: profile.baseUrl,
            timeout: profile.timeOut,
            headers: profile.headers
        })
        const ipfsClient = axios.create({
            baseURL: profile.ipfsMiddleware,
            headers: profile.headers,
        })
        const moralisClient = axios.create({
            baseURL: profile.moralisUrl,
            headers: profile.moralisHeaders,
            timeout: profile.timeOut,
        })

        const rpcClient = axios.create({
            baseURL: profile.polygonRpc,
            timeout: profile.timeOut,
        })
        this.httpClient = httpClient
        this.blockchainInteractor = blockchainInteractor
        this.ipfsClient = ipfsClient
        this.moralisClient = moralisClient
        this.rpcClient = rpcClient
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
                    throw 'an error occured when fetching transaction details'
                }
            }).catch(function(error) {
                throw error
            })
        } catch(error) {
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

    async fetchIPFSDoc(ipfsHash) {
        const url = profile.ipfsPublicNode + ipfsHash
        console.log("url:", url)
        const response = await fetch(url).then(result => result.json())
        console.log("response:", response)
        return response
    }

    async getCustomerPrivateKey() {
        // get passcode
        const passcodePath = FileSystem.documentDirectory + profile.currentCustomer.id + "inf.js"
        let passcodeString = await FileSystem.readAsStringAsync(passcodePath, {encoding: FileSystem.EncodingType.UTF8})
        let passcodeObject = JSON.parse(passcodeString)
        let passcode = passcodeObject.p

        const privPath = FileSystem.documentDirectory + 'sample.json'
        let stringToDecrypt = await FileSystem.readAsStringAsync(privPath, { encoding: FileSystem.EncodingType.UTF8 } )
        let decryptedObject = JSON.parse(stringToDecrypt)
        let encryptedRSAPrivKey = decryptedObject.decrypting
        let decryptedRSAPrivKey = CryptoES.AES.decrypt(encryptedRSAPrivKey, passcode).toString(CryptoES.enc.Utf8)
        return decryptedRSAPrivKey
    }

    async requestOpenAccount(txn) {
        const instance = this
        var savingsAccountID = ""
        var signedMsgFromBank = ""
        var txnHash = ""
        let clientIPFSReceiptHash = ""
        try {
            // step 1: connect to bank server
            await this.httpClient.post("/savings/create", this.createMessage(command.createAccount, txn))
            .then(async function (response) {
                if (response.status === 200) {
                    try {
                        savingsAccountID = response.data.details.savingsaccount_id
                        signedMsgFromBank = response.data.details.signature
                        console.log("Got data from the bank:", savingsAccountID, signedMsgFromBank)
                        let ipfsHash = response.data.details.receipt
                        // TODO: download file from ipfs to check message
                        let content = await instance.fetchIPFSDoc(ipfsHash)
                        console.log("do we have the content?:", content)
                        // let fetchedObject = JSON.parse(content)
                        let encryptedReceipt = content.receipt 
                        // decrypt = customer private key
                        let customerRSAPrivateKey = await instance.getCustomerPrivateKey()
                        // const rsa = new RSAKey()
                        // rsa.setPrivateString(customerRSAPrivateKey)
                        // let decryptedReceipt = rsa.decrypt(encryptedReceipt)
                        const crypt = new Crypt() 
                        const decryptedReceipt = crypt.decrypt(customerRSAPrivateKey, JSON.stringify(encryptedReceipt))
                        console.log("decrypted receipt:", decryptedReceipt)
                        let decryptedObject = JSON.parse(decryptedReceipt.message)
                        console.log("decrypted object:", decryptedObject)
                        let clientMsg = instance.createOpenTransactionMessage(txn, savingsAccountID)
                        console.log("client message:", clientMsg)
                        if (Object.entries(decryptedObject).toString() == Object.entries(clientMsg).toString()) {
                            [txnHash, clientIPFSReceiptHash] = await instance.blockchainInteractor.openTransaction(clientMsg, signedMsgFromBank, ipfsHash)
                        } else {
                            throw 'creation information mismatch'
                        }
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

            if (txnHash === "0x0") {
                throw "Transaction broadcast failed"
            }

            await this.httpClient.post("/savings/confirmation", this.createMessage(command.confirm, {
                "txn_hash": txnHash,
                "savingsaccount_id": savingsAccountID,
                "action": command.createAccount,
                "receipt": clientIPFSReceiptHash,
            })).then(function (response) {
                if (response.status != 204) {
                    throw "error sending back confirmation hash: " + response.data
                }
            }).catch(function (error) {
                throw error
            })
        } catch (error) {
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
                    let message = {
                        "savingsaccount_id": account.savingsAccountID,
                        "actual_interest_amount": account.actualInterestAmount,
                        "settle_time": account.settleTime,
                    }
                    instance.blockchainInteractor.verifySignature(message, bankSig)
                        .then(function(result){
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
        var result = null
        try {
            result = await this.httpClient.post("/register/exist", this.createMessage(command.checkEnrollment, {
                "customer_id": customerID
            })).then(function(response){
                return response.data.details.is_enrolled
            }).catch(function(error){
                throw error
            })
        } catch (error) {
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

    async postReceipt(stringToPost) {
        let ipfsHash = null
        try {
            console.log("string to post:", stringToPost)
            ipfsHash = await this.ipfsClient.post("/postReceipt", stringToPost)
                        .then(function(result) {
                            return result.data
                        }).catch(function(error) {
                            throw error
                        })
        } catch (error) {
            throw error
        }
        return ipfsHash
    }

    async requestSettleAccount(txn) {
        const instance = this
        var savingsAccountID = txn.savingsaccount_id
        var signedMsgFromBank = ""
        var txnHash = ""
        var clientReceiptIPFSHash = ""
        try {
            // step 1: connect to bank server
            await this.httpClient.post("/savings/settle", this.createMessage(command.settleAccount, txn))
            .then(async function (response) {
                if (response.status === 200) {
                    try {
                        signedMsgFromBank = response.data.details.signature
                        let ipfsHash = response.data.details.receipt
                        let clientMsg = instance.createSettleTransactionMessage(txn)
                        let fetchedObject = await instance.fetchIPFSDoc(ipfsHash)
                        console.log("do we have the content?:", fetchedObject)
                        let encryptedReceipt = fetchedObject.receipt 
                        let customerRSAPrivateKey = await instance.getCustomerPrivateKey()
                        console.log("Customer RSA private key:", customerRSAPrivateKey)
                        console.log("going to decrypt:", encryptedReceipt)
                        // const rsa = new RSAKey()
                        // rsa.setPrivateString(customerRSAPrivateKey)
                        // let decryptedReceipt = rsa.decrypt(encryptedReceipt)
                        const crypt = new Crypt() 
                        const decryptedReceipt = crypt.decrypt(customerRSAPrivateKey, JSON.stringify(encryptedReceipt))
                        console.log("decrypted receipt:", decryptedReceipt)
                        let decryptedObject = JSON.parse(decryptedReceipt.message)
                        console.log("decrypted object:", decryptedObject)
                        console.log("client message:", clientMsg)
                        if (Object.entries(decryptedObject).toString() == Object.entries(clientMsg).toString()) {
                            [txnHash, clientReceiptIPFSHash] = await instance.blockchainInteractor.settleTransaction(clientMsg, signedMsgFromBank, ipfsHash)
                            console.log("Returned txnHash:", txnHash)
                        } else {
                            throw 'settle information mismatch'
                        }
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

            if (txnHash === "0x0") {
                throw "Transaction broadcast failed"
            }

            // step 3: sending back txnHash for confirmation
            await this.httpClient.post("/savings/confirmation", this.createMessage(command.confirm, {
                "txn_hash": txnHash,
                "savingsaccount_id": savingsAccountID,
                "action": command.settleAccount,
                "receipt": clientReceiptIPFSHash,
            })).then(function (response) {
                if (response.status != 204) {
                    throw "error sending back confirmation hash: " + response.data
                }
            }).catch(function (error) {
                throw error
            })
        } catch (error) {
            throw this.errorNotification("error when settle account", error)
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

    async registerBlockchainReceiptService(customerID, customerAddress, publicKey) {
        let result = null
        try {
            result = await this.httpClient.post("/register/blockchainReceiptService", this.createMessage(command.registerService, {
                "customer_id": customerID,
                "customer_address": customerAddress,
                "public_key": publicKey,
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

    async deactivateAccount(customerAddress) {
        let result = null 
        try {
            result = await this.httpClient.post("/account/deactivate", this.createMessage(command.deactivate, {
                "customer_address": customerAddress
            })).then(function(response) {
                return response.data
            }).catch(function(error) {
                throw error
            })
        } catch (error) {
            throw error
        }
        return result
    }

    async getReceiptHashFromTxn(txnHash) {
        let result = null 
        const instance = this
        try {
            await this.rpcClient.post("", {
                jsonrpc: "2.0",
                method: "eth_getTransactionReceipt",
                params: [txnHash],
                id: 1,
            }).then(async function(response){
                console.log("what is our response?", response.data)
                let logData = response.data.result.logs[0].data 
                let topics = response.data.result.logs[0].topics
                let decodedLog = instance.blockchainInteractor.abi.parseLog({
                    topics: topics,
                    data: logData,
                })
                let receiptHash = decodedLog.args[decodedLog.args.length - 1] // TODO: continue this
                console.log("what is our decoded data?", receiptHash)
                let content = await instance.fetchIPFSDoc(receiptHash)
                // try to decrypt this
                let customerRSAPrivateKey = await instance.getCustomerPrivateKey()
                const crypt = new Crypt() 
                console.log("Going to decrypt:", content.receipt)
                const decryptedReceipt = crypt.decrypt(customerRSAPrivateKey, JSON.stringify(content.receipt))
                result = [content, decryptedReceipt]
                return result
            }).catch(function(error) {
                throw error
            })
        } catch (error) {
            throw error
        }

        return result
    }
}

module.exports.Client = Client



