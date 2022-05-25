const profile = require("../constant/env").profile
const ethers = require("ethers")
const { hexZeroPad } = require("ethers/lib/utils")
const CONTRACT_ABI = require("./contractabi.json")
// const CONTRACT_ABI = ""
// import 'ethers/dist/shims.js';


class BlockchainInteractor {
    constructor(privateKey) {
        const wallet = new Wallet(privateKey)
        const contractABI = new ethers.utils.Interface(CONTRACT_ABI)
        this.wallet = wallet
        // this.verifier = new Verifier(wallet)
        this.abi = contractABI
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

    // redefine function on smart contract side: Bank side
    // function openTransaction(
    //     bytes32 message,
    //     bytes[2] signatures,
    // )
    async openTransaction (txn, bankSignedTxn) {
        // verify bankSignedTxn
        if (!this.wallet.verifier.verifyMessage(txn, bankSignedTxn, profile.bankOwner)) {
            throw 'WARNING: invalid bank signature on message! Please contact the bank for more information!'
        }

        let txnString = JSON.stringify(txn)
        var signature = await this.wallet.verifier.signMessage(txnString)
        console.log("signature:", signature)
        const hashedTxn = this.wallet.verifier.hashMessage(txnString)
        console.log("hashedTx:", hashedTxn)
        let calldata = this.abi.encodeFunctionData("BroadcastOpenAccountTransaction", [
            this.wallet.address,
            hashedTxn,
            [
                signature,
                bankSignedTxn,
            ]
        ])
        console.log("checkpoint 1.1")
        let result = await this.wallet.wallet.sendTransaction({
            to: profile.contractAddress,
            gasPrice: ethers.utils.hexlify(20000000000),
            gasLimit: ethers.utils.hexlify(1000000),
            data: calldata,
        }, function(error, hash) {
            console.log("do we have any errors:", error)
            if (error != null) {
                console.log("Error when performing transaction:", error)
                throw error
            }
            return hash
        })

        console.log("txnHash:", result.hash)
        // step 4: decode to get txn hash here for return
        return result.hash
    }

    // redefine function on smart contract side: Bank side
    // function settleTransaction(
    //     bytes32 message,
    //     bytes[2] signatures,
    // )
    async settleTransaction (txn, bankSignedTxn)  {
        // verify bankSignedTxn
        if (!this.wallet.verifier.verifyMessage(txn, bankSignedTxn, profile.bankOwner)) {
            throw 'WARNING: invalid bank signature on message! Please contact the bank for more information!'
        }

        let txnString = JSON.stringify(txn)
        var signature = await this.wallet.verifier.signMessage(txnString)
        console.log("signature:", signature)
        const hashedTxn = this.wallet.verifier.hashMessage(txnString)
        console.log("hashedTx:", hashedTxn)
        let calldata = this.abi.encodeFunctionData("BroadcastSettleAccountTransaction", [
            this.wallet.address,
            hashedTxn,
            [
                signature,
                bankSignedTxn,
            ]
        ])

        console.log("Here we are, ready to send")

        let result = await this.wallet.wallet.sendTransaction({
            to: profile.contractAddress,
            gasPrice: ethers.utils.hexlify(20000000000),
            gasLimit: ethers.utils.hexlify(1000000),
            data: calldata,
        }, function(error, hash) {
            console.log("do we have error?:", error)
            if (error != null) {
                console.log("Error when performing transaction:", error)
                throw error
            }
            console.log(hash)
            return hash
        })

        console.log("txnHash:", result.hash)
        // step 4: decode to get txn hash here for return
        return result.hash
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
        const node = new ethers.providers.WebSocketProvider("https://speedy-nodes-nyc.moralis.io/f2b19a3c16403baa4483c731/polygon/mumbai/archive")
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