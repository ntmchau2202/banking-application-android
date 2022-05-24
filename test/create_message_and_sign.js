const Common = require("@ethereumjs/common").default
const { default: BigNumber } = require('bignumber.js');
const ethers = require("ethers")
const CustomChain = require("@ethereumjs/common").CustomChain
const Transaction = require("@ethereumjs/tx").Transaction;

const privateKey = Buffer.from(
    '7d0330973175291e2f52f4cb44572084e4580a7dbf00ba3c10ff463f1ad75e9e',
    'hex',
    )


// initialize network
const mumbaiNetwork = 'wss://speedy-nodes-nyc.moralis.io/f2b19a3c16403baa4483c731/polygon/mainnet/ws';
const node = new ethers.providers.WebSocketProvider(mumbaiNetwork)

// connect wallet and network
// const wallet = new ethers.Wallet(privateKey, node)
// const provider = wallet.connect(node)

async function main() {
    const message = {
        "customer_id": "N-0001",
        "savingsaccount_id": "O-ABCD-MNPQ-1235",
		"product_type": "Online",
		"savings_period": 6,
		"interest_rate": 6.9,
		"savings_amount": 1000000,
		"estimated_interest_amount": 100000,
		"settle_instruction": "SETTLE_ALL",
		"currency": "VND",
		"open_time": "Sat, 02 Apr 2022 16:50:44 +07",
		"bank_id": "VCB"
    }

    msgString = JSON.stringify(message)
    let hash = ethers.utils.id(msgString)
    console.log(hash)
    // return
    // console.log(msgString)

    // let signature = await wallet.signMessage(msgString)
    // console.log("signature:", signature)

    // let address = await ethers.utils.verifyMessage(msgString, signature)
    // console.log(address)

    const wallet = ethers.Wallet.createRandom()
    console.log('address:', wallet.address)
    console.log('mnemonic:', wallet.mnemonic.phrase)
    console.log('privateKey:', wallet.privateKey)
    console.log('public key:', wallet.publicKey)

    // let signer = node.getSigner()
    // let signerAddress = signer.getAddress()
    // console.log("signer address:", signerAddress)

    const signature = await wallet.signMessage(msgString)
    console.log('signature:', signature)
    console.log('hash:', signature.hash())
    let confirmAddr = await ethers.utils.verifyMessage(msgString, signature)

    console.log("confirmed Address:", confirmAddr)

    //0xb63617c9c14f0911ceb0255fec33792615a3727d54dc85932db6e48731732664
    //0xcbac451a79a47705f893e94e58d2ef9a7914e28141f6fb8f37879cb17d61cc4650721bf212067775c8645a4a5ea8c6a4cc586466611cedc78065717fb02414781b
}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
);