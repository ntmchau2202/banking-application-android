const ethers = require('ethers')
const moment = require('moment')

// initialize network
const mumbaiNetwork = 'wss://speedy-nodes-nyc.moralis.io/f2b19a3c16403baa4483c731/polygon/mumbai/ws';
const node = new ethers.providers.WebSocketProvider(mumbaiNetwork)
const DELTA = 1000

const getBlock = blockNum => node.getBlock(blockNum)
const getTimestamp = blockObject => blockObject.timestamp
const getLatestBlockNumber = _ => node.getBlockNumber()
const getLatestBlockTimestamp = _ => getLatestBlockNumber().then(getTimestamp)
const getTimestampFromBlock = _blockNum => getBlock(_blockNum).then(getTimestamp)

async function search(bottomBlock, topBlock, currentBlock, targetTimestamp) {
    // console.log("===========")
    let currentTimestamp = await getTimestampFromBlock(currentBlock)
    // console.log("topBlock:", topBlock)
    // console.log("bottomBlock:", bottomBlock)
    // console.log("CurrentBlock:", currentBlock)
    // console.log("currentTimestamp vs targetTimestamp", currentTimestamp, " ", targetTimestamp)
    if (targetTimestamp === currentTimestamp || Math.abs(currentTimestamp - targetTimestamp) < DELTA) {
        // console.log("Might be the block we wanted:", currentBlock)
        return currentBlock
    } else if (currentTimestamp - targetTimestamp > 0) { // on the left
        // console.log("on the left")
        return search(bottomBlock, currentBlock, Math.round(currentBlock / 2), targetTimestamp)
    } else if (currentTimestamp - targetTimestamp < 0 ) {
        // console.log("on the right")
        return search(currentBlock, topBlock, Math.round((currentBlock + topBlock) / 2), targetTimestamp)
    }
}


async function main() {
    let fromDate = moment('2022-01-04', "YYYY-MM-DD").format("X")
    let toDate = moment('2022-01-05', "YYYY-DD-MM").format("X")

    const latestBlockNum = await getLatestBlockNumber()
    // console.log("latestBlockNum:", latestBlockNum)
    console.log("serach startblock")
    const startBlock = await search(0, latestBlockNum, Math.round(latestBlockNum / 2), fromDate)
    console.log("search endblock")
    const endBlock = await search(startBlock, latestBlockNum, Math.round((startBlock + latestBlockNum) / 2), toDate)
    const startBlockTimestamp = await getTimestampFromBlock(startBlock)
    const endBlockTimestamp = await getTimestampFromBlock(endBlock)
    console.log(
      `\nFor a start date of 2022-01-04 (which timestamp = ${fromDate}) the nearest block (within ${DELTA} seconds) is block: ${startBlock} (whose timestamp of ${startBlockTimestamp} is ${startBlockTimestamp - fromDate} seconds away from target start date.)`,
      `\nFor an end date of '2022-01-05' (which timestamp = ${toDate}) the nearest block (within ${DELTA} seconds) is block: ${endBlock} (whose timestamp of ${endBlockTimestamp} is ${endBlockTimestamp - toDate} seconds away from target end date.)`
    )
}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1);
    },
);