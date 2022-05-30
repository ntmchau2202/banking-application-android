const profile = require("../constant/env").profile
const ethers = require("ethers")
const { hexZeroPad } = require("ethers/lib/utils")
const CONTRACT_ABI = require("./contractabi.json")
import * as FileSystem from 'expo-file-system'
import RSAKey from 'react-native-rsa'


class BlockchainInteractor {
    constructor(privateKey) {
        const wallet = new Wallet(privateKey)
        const contractABI = new ethers.utils.Interface(CONTRACT_ABI)
        const contract = new ethers.Contract(profile.contractAddress, CONTRACT_ABI, wallet.provider)
        this.wallet = wallet
        this.abi = contractABI
        this.contract = contract
    }

    getNode() {
        return this.wallet.node
    }

    encodeTopic (topic) {
        if (topic !== null) {
            if (length(topic) === 1) {
                return hexZeroPad(topic, 32)
            } else {
                let arrTopic = []
                for (let i = 1; i < length(topic); i++) {
                    let t1 = hexZeroPad(topic[i], 32)
                    arrTopic.push(t1)
                }
                return arrTopic
            }
        } else {
            return null
        }
    }

    createFilter(contractAddress, topic0, topic1, topic2, topic3) {
        var argT0 = BankInterface.getEvent(topic0).format(FormatTypes.minimal)
        argT0 = argT0.substring(6, argT0.length)
        
        let filter = {
            address: contractAddress,
            topics: [
                ethers.utils.id(argT0),
            ]
        }

        let argT1 = encodeTopic(topic1)
        let argT2 = encodeTopic(topic2)
        let argT3 = encodeTopic(topic3)

        filter.topics.concat(argT1)
        filter.topics.concat(argT2)
        filter.topics.concat(argT3)

        return filter
    }

    stringToBytes32(text) {
        let result = ethers.utils.toUtf8Bytes(text)
        if (result.length > 32) { throw new Error('String too long') }
        result = ethers.utils.hexlify(result);
        while (result.length < 66) { result += '0'; }
        if (result.length !== 66) { throw new Error("invalid web3 implicit bytes32"); }
        return result;
    }

    async getBankPublicKey() {
        const path = FileSystem.documentDirectory + 'sample.json'
        let stringToDecrypt = await FileSystem.readAsStringAsync(privPath, { encoding: FileSystem.EncodingType.UTF8 } )
        let obj = JSON.parse(stringToDecrypt)
        let bankPublicKey = obj.bank_public_key
        return bankPublicKey
    }
    
    async encryptReceiptDetails(receiptDetails) {
        const receiptString = JSON.stringify(receiptDetails)
        const bankPublicKey = await this.getBankPublicKey()
        const rsa = new RSAKey()
        rsa.setPublicString(bankPublicKey)
        const receiptEncrypted = rsa.decrypt(receiptString)
        // const receiptEncrypted = RSA.encrypt(receiptString, bankPublicKey)
        return receiptEncrypted
    }

    async broadcastToIPFS(type, encryptedReceipt, signature) {
        let currentTime = new Date().toUTCString()
        let object = {
            "time_created": currentTime,
            "type": "create",
            "customer_signature": signature,
            "receipt": encryptedReceipt
        }
        let jsonString = JSON.stringify(object)
    
        // let contentBuffer = Buffer.from(jsonString)
        let base64String = btoa(jsonString)
    
        // connect to moralis node
        let url = config.ipfsNodeLink
        let applicationID = config.ipfsAppID
        let masterKey = config.ipfsMasterKey
        let prefix = ""
        if (type == "settle") {
            prefix = "settle_"
        } else if (type == "create") {
            prefix = "create_"
        }
        let fileName = prefix + currentTime + ".json"
        await Moralis.start({serverUrl: url,
                            appId: applicationID,
                            masterKey: masterKey})
        const moralisFile = new Moralis.File(fileName, {base64: base64String}, 'application/json')
        const result = await moralisFile.saveIPFS({useMasterKey: true})
    
        console.log(result._hash)
    }

    async openTransaction(txn, bankSignedTxn) {
        // verify bankSignedTxn
        if (!this.wallet.verifier.verifyMessage(txn, bankSignedTxn, profile.bankOwner)) {
            throw 'WARNING: invalid bank signature on message! Please contact the bank for more information!'
        }

        let txnString = JSON.stringify(txn)
        var signature = await this.wallet.verifier.signMessage(txnString)
        console.log("signature:", signature)
        // if things r ok, create a receipt and upload it to ipfs
        let encryptedReceipt = await this.encryptReceiptDetails(txn)
        let ipfsHash = await this.broadcastToIPFS("open", encryptedReceipt, signature)
        const hashedTxn = this.wallet.verifier.hashMessage(txnString)
        console.log("hashedTx:", hashedTxn)
        const fetchedGasPrice = this.wallet.node.getGasPrice()
        const estimatedGas = 3000000

        console.log("checkpoint 1.1")
        let pending = await this.contract.BroadcastOpenAccountTransaction(
            hashedTxn,
            [
                signature,
                bankSignedTxn,
            ],
            ipfsHash,
            {
                gasPrice: fetchedGasPrice,
                gasLimit: ethers.utils.hexlify(estimatedGas)
            }
        )

        console.log("Transaction hash:", pending.hash)

        let receipt = null 
        while (receipt == null) {
            receipt = await this.wallet.node.getTransactionReceipt(pending.hash)
        }

        if (receipt.status == 1) {
            return [receipt.transactionHash, ipfsHash]
        } else {
            return ["0x0", ""]
        }
    }

    async settleTransaction (txn, bankSignedTxn)  {
        // verify bankSignedTxn
        if (!this.wallet.verifier.verifyMessage(txn, bankSignedTxn, profile.bankOwner)) {
            throw 'WARNING: invalid bank signature on message! Please contact the bank for more information!'
        }

        let txnString = JSON.stringify(txn)
        var signature = await this.wallet.verifier.signMessage(txnString)
        console.log("signature:", signature)

        let encryptedReceipt = await this.encryptReceiptDetails(txn)
        let ipfsHash = await this.broadcastToIPFS("settle", encryptedReceipt, signature)

        const hashedTxn = this.wallet.verifier.hashMessage(txnString)
        console.log("hashedTx:", hashedTxn)

        const fetchedGasPrice = this.wallet.node.getGasPrice()
        const estimatedGas = 3000000

        let pending = await this.contract.BroadcastSettleAccountTransaction(
            hashedTxn,
            [
                signature,
                bankSignedTxn,
            ], 
            ipfsHash, 
            {
                gasPrice: fetchedGasPrice,
                gasLimit: ethers.utils.hexlify(estimatedGas)
            }
        )

        console.log("Transaction hash:", pending.hash)

        let receipt = null 
        while (receipt == null) {
            receipt = await this.wallet.node.getTransactionReceipt(pending.hash)
        }

        if (receipt.status == 1) {
            return [receipt.transactionHash, ipfsHash]
        } else {
            return ["0x0", ""]
        }
    }

    fetchOpenTransactionsFromChain() {
        // step 1: create a filter
        // step 2: fetch
        let filter = encodeTopic("Open", savingsAccount, null, null)
        
        let promise = node.getLogs(filter);
        let result = promise.wait()
        // step 3: decode
       
    }

    fetchSettleTransactionsFromChain() {
        // step 1: create a filter
        // step 2: fetch
        
        let filter = encodeTopic("Settle", savingsAccount, null, null)
        
        let promise = node.getLogs(filter);
        let result = promise.wait()
        // step 3: decode
    }

    fetchTransactionsFromChain() {
        let openTransactions = fetchOpenTransactionsFromChain()
        let settleTransactions = fetchSettleTransactionsFromChain()
        return openTransactions, settleTransactions
    }

    decodeInput(method, data) {
        return this.abi.decodeFunctionData(method, data)
    }

    async verifySignature(originalMessage, bankSignature) {
        if (!this.wallet.verifier.verifyMessage(originalMessage, bankSignature, profile.bankOwner)) {
            throw 'WARNING: invalid bank signature on message! Please contact the bank for more information!'
        }
        let txnString = JSON.stringify(originalMessage)
        var signature = await this.wallet.verifier.signMessage(txnString)
        console.log("signature:", signature)
        const hashedTxn = this.wallet.verifier.hashMessage(txnString)
        console.log("hashedTx:", hashedTxn)

        let contractInstance = new ethers.Contract(profile.contractAddress, CONTRACT_ABI, this.wallet.node)
        console.log("contract instance created successfully")
        let result = await contractInstance.verifyUser(hashedTxn, [signature, bankSignature])
        return result
    }
}

class Verifier  {
    constructor(wallet) {
        this.wallet = wallet
    }

    appendPrefix(message) {
        // note: the message must be of string type
        const prefix = "\x19Ethereum Signed Message:\n" + String(message.length) 
        const actualMessage = prefix + message 
        return actualMessage
    }

    async signMessage(message) {
        // let actualMessage = this.appendPrefix(message)
        const signature = await this.wallet.signMessage(message)
        return signature
    }

    hashMessage(message) {
        let actualMessage = this.appendPrefix(message)
        return ethers.utils.id(actualMessage)
    }

    verifyMessage(message, signature, targetAddress) {
        let messageString = JSON.stringify(message)
        console.log("message to verify:", messageString)
        const recovered = ethers.utils.verifyMessage(messageString, signature)
        console.log("recovered address:", recovered)
        console.log("target address:", targetAddress)
        if (recovered === targetAddress) {
            return true
        } else {
            return false
        }
    }
}

class Wallet {
    // const wallet = ethers.ethers.Wallet
    // const verifier = Verifier
    constructor (privateKey) {
        // const node = new ethers.providers.JsonRpcProvider(profile.blockchainNode)
        // const node = new ethers.providers.InfuraProvider('maticmum', {
        //     projectId: "7d8f19d50b954a0fa348985e6079f108",
        //     projectSecret: "05a5c4239e914fef9b00bfecbd456a61",
        // })
        const node = new ethers.providers.WebSocketProvider("wss://speedy-nodes-nyc.moralis.io/f2b19a3c16403baa4483c731/polygon/mumbai/ws")
        // console.log("node:", node)
        // const node = new ethers.providers.WebSocketProvider(profile.blockchainNode)
        // const node = new ethers.providers.Web3Provider(ganache.provider())
        console.log("node:", node)
        const wallet = new ethers.Wallet(privateKey, node)
        const provider = wallet.connect(node)
        const verifier = new Verifier(wallet)
        this.node = node
        this.wallet = wallet 
        this.provider = provider
        this.verifier = verifier
        this.address = wallet.address
    }
}

module.exports.BlockchainInteractor = BlockchainInteractor