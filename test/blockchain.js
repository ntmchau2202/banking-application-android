const CONTRACT_ABI = require('./bankFactory.json')
const ethers = require('ethers')

const privateKey = Buffer.from(
    '7d0330973175291e2f52f4cb44572084e4580a7dbf00ba3c10ff463f1ad75e9e',
    'hex'
)

const node = new ethers.providers.WebSocketProvider("wss://speedy-nodes-nyc.moralis.io/f2b19a3c16403baa4483c731/polygon/mumbai/ws")
const wallet = new ethers.Wallet(privateKey, node)
const provider = wallet.connect(node)
const contractAddress = "0x76c31Df6975F1fcaD2d1b87d4BD360e078B678Ff"
let blockchainClient = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)

const awaitMinedTxn = require('await-transaction-mined')

// async function main() {
//     console.log('hello?')
//     let fetchedGasPrice = await node.getGasPrice()
//     let idx = await node.getTransactionCount(wallet.address)
//     let estimatedGas = 3000000

//     console.log(fetchedGasPrice)
//     console.log(estimatedGas)
//     console.log(idx)

//     let contractABIInterface = new ethers.utils.Interface(CONTRACT_ABI)

//     let bankSignature = '0x9e2eca01e6a84e46bbe48e0d0415718ca5d009599e70e08cda2c3b8d886c9d887d4f288c2164abe4a4a97bada1ef380dc80ab189450e9e3ea20b0fdb27c2dda01c'
//     let customerSignature = '0xe08d60da19eae2f7f473047aff5c7699736f5562917cd8827b0d25ba45e0f6120fd8297119a8b066dc44362fd66db7d5b2c9d47a9b5b0395563bf8c79d43e0371c' 
//     let messageHash = '0x7347e28d4e80e46ee3e836b7cd247639f826b879114435cd0161eac2cc80f517'

    
//     // let calldata = contractABIInterface.encodeFunctionData("BroadcastOpenAccountTransaction", [
//     //     messageHash,
//     //     [
//     //         customerSignature,
//     //         bankSignature,
//     //     ]
//     // ])

//     // let signedTxn = await wallet.signTransaction(calldata)
//     // let pending = await wallet.sendTransaction("BroadcastOpenAccountTransaction", signedTxn, function(result, error) {
//     //     console.log("result:", result)
//     //     if (error != null) {
//     //         throw error
//     //     }
//     // })

//     let pending = await blockchainClient.BroadcastOpenAccountTransaction(
//         messageHash,
//         [
//             customerSignature,
//             bankSignature,
//         ], {
//             gasPrice: fetchedGasPrice,
//             gasLimit: ethers.utils.hexlify(estimatedGas)
//         }
//     )
//     console.log("pending:", pending)
//     console.log('Txn hash:', pending.hash)
//     // await pending.wait()
//     // console.log('recept:', receipt.getBlock())
//     // let receipt = await node.getTransaction(pending.hash)
//     // const receipt = await awaitMinedTxn.awaitTx(node, pending.hash)
//     // const recipt = await provider.populateTransaction()
//     let receipt = null
//     while (receipt == null) {
//         try {
//             receipt = await node.getTransactionReceipt(pending.hash)
//         } catch (error) {
//             continue
//         }
//     }

//     console.log(receipt.blockHash)
//     console.log(receipt.status)

// }

async function main() {
    console.log('hello?')
    let fetchedGasPrice = await node.getGasPrice()
    let idx = await node.getTransactionCount(wallet.address)
    let estimatedGas = 3000000

    console.log(fetchedGasPrice)
    console.log(estimatedGas)
    console.log(idx)

    let contractABIInterface = new ethers.utils.Interface(CONTRACT_ABI)

    let bankSignature = '0x9e2eca01e6a84e46bbe48e0d0415718ca5d009599e70e08cda2c3b8d886c9d887d4f288c2164abe4a4a97bada1ef380dc80ab189450e9e3ea20b0fdb27c2dda01c'
    let customerSignature = '0xe08d60da19eae2f7f473047aff5c7699736f5562917cd8827b0d25ba45e0f6120fd8297119a8b066dc44362fd66db7d5b2c9d47a9b5b0395563bf8c79d43e0371c' 
    let messageHash = '0x7347e28d4e80e46ee3e836b7cd247639f826b879114435cd0161eac2cc80f517'

    
    let calldata = contractABIInterface.encodeFunctionData("BroadcastOpenAccountTransaction", [
        messageHash,
        [
            customerSignature,
            bankSignature,
        ]
    ])

    let msg =   {
        to: contractAddress,
        gasPrice: fetchedGasPrice,
        gasLimit: ethers.utils.hexlify(estimatedGas),
        data: calldata,
        nonce: idx,
    }

    let signedTxn = await wallet.signTransaction(msg)

    let pending = await wallet.sendTransaction("BroadcastOpenAccountTransaction", 
    signedTxn
    , function(result, error) {
        console.log("result:", result)
        if (error != null) {
            throw error
        }
    })


    let receipt = null
    while (receipt == null) {
        try {
            receipt = await node.getTransactionReceipt(pending.hash)
        } catch (error) {
            continue
        }
    }

    console.log(receipt.blockHash)
    console.log(receipt.status)

}


main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
);