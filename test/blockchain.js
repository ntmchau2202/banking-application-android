const ethers = require('ethers')
const { FormatTypes, hexZeroPad } = require('ethers/lib/utils')

const localNetwork = "http://localhost:8545"
const privateKey = Buffer.from(
    "3d53eac1c858a087333fbddad28f4f93b6d29fcd54f932a2ec1d5616d6e52a4d",
    "hex")

const node = new ethers.providers.JsonRpcProvider(localNetwork)
const wallet = new ethers.Wallet(privateKey, node)
const provider = wallet.connect(node)

const bankFactoryAddress = "0xAc8d4B4CFb156Ae0FB267C93686fF0179f263123"
const bankFactoryABI = require("./bankFactory.json")

const BankFactory = new ethers.Contract(bankFactoryAddress, bankFactoryABI, node)
const BankInterface = new ethers.utils.Interface(bankFactoryABI)

async function main() {
    let gasPrice = await provider.getGasPrice()
    console.log(gasPrice)

    let numOfBanks = await BankFactory.numOfBanks()
    console.log(numOfBanks)
    var topic0 = BankInterface.getEvent("Settle").format(FormatTypes.minimal)
    topic0 = topic0.substring(6, topic0.length)
    console.log(topic0)
}

async function filterSettleSavingsAccount(savingsAccount) {
    var topic0 = BankInterface.getEvent("Settle").format(FormatTypes.minimal)
    topic0 = topic0.substring(6, topic0.length)

    let filter = {
        address: "contract_address_here",
        topics: [
            utils.id(topic0),
            hexZeroPad(savingsAccount, 32),
        ]
    }
}

async function filterSettleSavingsAccountWithBank(savingsAccount, bankName) {
    var topic0 = BankInterface.getEvent("Settle").format(FormatTypes.minimal)
    topic0 = topic0.substring(6, topic0.length)

    let filter = {
        address: "contract_address_here",
        fromBlock: 0,
        topics: [
            utils.id(topic0),
            hexZeroPad(savingsAccount, 32),
            null,
            hexZeroPad(bankName, 32),
        ]
    }

    let promise = await node.getLogs(filter);
    let result = promise.wait()
    console.log(result)
}

async function filterOpenSavingsAccount(savingsAccount) {
    var topic0 = BankInterface.getEvent("Open").format(FormatTypes.minimal)
    topic0 = topic0.substring(6, topic0.length)

    let filter = {
        address: "contract_address_here",
        fromBlock: 0,
        topics: [
            utils.id(topic0),
            hexZeroPad(savingsAccount, 32),
        ]
    }

    let promise = await node.getLogs(filter);
    let result = promise.wait()
    console.log(result)
}

async function filterOpenSavingsAccountWithBank(savingsAccount, bankName) {
    var topic0 = BankInterface.getEvent("Open").format(FormatTypes.minimal)
    topic0 = topic0.substring(6, topic0.length)

    let filter = {
        address: "contract_address_here",
        fromBlock: 0,
        topics: [
            utils.id(topic0),
            hexZeroPad(savingsAccount, 32),
            null,
            hexZeroPad(bankName, 32),
        ]
    }

    let promise = await node.getLogs(filter);
    let result = promise.wait()
    console.log(result)
}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
);