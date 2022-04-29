const profile = require("../constant/env").profile
const ethers = require("ethers")
// const CONTRACT_ABI = require("./contractabi.json")
const CONTRACT_ABI = ""


class BlockchainInteractor {
    constructor(privateKey) {
        const wallet = new Wallet(privateKey)
        // const contractABI = new ethers.utils.Interface(CONTRACT_ABI)
        this.wallet = wallet
        // this.abi = contractABI
    }

    #encodeTopic (topic) {
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

    #createFilter(contractAddress, topic0, topic1, topic2, topic3) {
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

    // redefine function on smart contract side: Bank side
    // function openTransaction(
    //     bytes32 message,
    //     bytes[2] signatures,
    // )
    openTransaction (txn, bankSignedTxn) {
        // verify bankSignedTxn
        if (!this.wallet.verifier.verifyMessage(txn, bankSignedTxn, profile.bankWalletAddress)) {
            throw 'WARNING: invalid bank signature on message! Please contact the bank for more information!'
        }

        txnString = JSON.stringify(txn)
        const signature = wallet.signMessage(txnString)

        let contractABI = abi()
        let calldata = contractABI.encodeFunctionData("OpenTransaction", [
            txn,
            [
                signature,
                bankSignedTxn
            ]
        ])

        let promise = wallet.wallet.sendTransaction({
            to: profile.contractAddress,
            data: calldata,
        })

        let result = promise.wait()
        // step 4: decode to get txn hash here for return
        return result
    }

    // redefine function on smart contract side: Bank side
    // function settleTransaction(
    //     bytes32 message,
    //     bytes[2] signatures,
    // )
    settleTransaction (txn, bankSignedTxn)  {
        // verify bankSignedTxn
        if (!this.wallet.verifier.verifyMessage(txn, bankSignedTxn, profile.bankWalletAddress)) {
            throw 'WARNING: invalid bank signature on message! Please contact the bank for more information!'
        }

        txnString = JSON.stringify(txn)
        const signature = wallet.signMessage(txnString)

        let contractABI = abi()
        let calldata = contractABI.encodeFunctionData("SettleTransaction", [
            txn,
            [
                signature,
                bankSignedTxn
            ]
        ])

        let promise = wallet.wallet.sendTransaction({
            to: profile.contractAddress,
            data: calldata,
        })

        let result = promise.wait()
        // step 4: decode to get txn hash here for return
        return result
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
}

class Verifier  {
    constructor(wallet) {
        this.wallet = wallet
    }
    signMessage (message) {
        const prefix = "\x19Ethereum Signed Message:\n" + String(message.length) 
        const actualMessage = prefix + message 
        const signature = this.wallet.wallet.signMessage(actualMessage)
        return signature, signature.hash()
    }

    verifyMessage(message, signature, targetAddress) {
        const recovered = ethers.utils.verifyMessage(message, signature)
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
        const node = new ethers.providers.WebSocketProvider(profile.blockchainNode)
        const wallet = new ethers.Wallet(privateKey, node)
        const provider = wallet.connect(node)
        const verifier = new Verifier(wallet)

        this.node = node
        this.wallet = wallet 
        this.provider = provider
        this.verifier = verifier
    }
}

module.exports.BlockchainInteractor = BlockchainInteractor