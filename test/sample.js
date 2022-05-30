const moment = require('moment')
const assert = require('assert')
const ethers = require('ethers');
const { start } = require('repl');
const Web3 = require('web3')

// initialize network
const mumbaiNetwork = 'wss://speedy-nodes-nyc.moralis.io/f2b19a3c16403baa4483c731/polygon/mumbai/ws';
const node = new ethers.providers.WebSocketProvider(mumbaiNetwork)
// const web3Node = new Web3.default.providers.WebsocketProvider(mumbaiNetwork)
const DELTA = 1000

const getBlock = blockNum => node.getBlock(blockNum)
const getTimestamp = blockObject => blockObject.timestamp
const getLatestBlockNumber = _ => node.getBlockNumber()
const getLatestBlockTimestamp = _ => getLatestBlockNumber().then(getTimestamp)
const getTimestampFromBlock = _blockNum => getBlock(_blockNum).then(getTimestamp)

async function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
    if (endBlockNumber == null) {
      endBlockNumber = eth.blockNumber;
      console.log("Using endBlockNumber: " + endBlockNumber);
    }
    if (startBlockNumber == null) {
      startBlockNumber = endBlockNumber - 1000;
      console.log("Using startBlockNumber: " + startBlockNumber);
    }
    console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
  
    for (var i = startBlockNumber; i <= endBlockNumber; i++) {
        // if (i % 1000 == 0) {
        //     console.log("Searching block " + i);
        // }
      var block = await node.getBlock(i);
    //   console.log("block fetched:", block.hash)
      if (block != null && block.transactions != null) {
        block.transactions.forEach( function(e) {
          if (myaccount == "*" || myaccount.toLowerCase() == e.from || myaccount.toLowerCase() == e.to) {
            console.log("  tx hash          : " + e.hash + "\n")
          }
        })
      }
    }
  }

const mainLoop = (_bottomRange, _topRange, _current, _target) =>
  getTimestampFromBlock(_current)
    .then(timestamp =>
      (_target - timestamp) >>> 0 <= DELTA
        ? _current
        : _target - timestamp <= 0
        ? mainLoop(_bottomRange, _current, Math.round((_current - _bottomRange) / 2) + _bottomRange, _target)
        : mainLoop(_current, _topRange, Math.round((_topRange - _current) / 2) + _current, _target)) // Top half

const main = async () => {
//   assert.equal((process.argv[2] != undefined) && (process.argv[3] != undefined), true, "Please provide a start & end date in the form YYYY-MM-DD")
//   const startDate = moment(process.argv[2], "YYYY-MM-DD").format("X")
//   const endDate = moment(process.argv[3], "YYYY-MM-DD").format("X")
  let startDate = moment('2022-04-01', "YYYY-MM-DD").format("X")
  let endDate = moment('2022-05-22', "YYYY-MM-DD").format("X")
  assert.equal(endDate > startDate, true, "Please provide an end date LATER than the start date!")
  try {
    const latestBlockNum = await getLatestBlockNumber()
    const startBlock = await mainLoop(Math.round(latestBlockNum / 2), latestBlockNum, latestBlockNum, startDate)
    const endBlock = await mainLoop(startBlock, latestBlockNum, latestBlockNum, endDate)
    const startBlockTimestamp = await getTimestampFromBlock(startBlock)
    const endBlockTimestamp = await getTimestampFromBlock(endBlock)
    console.log(
      `\nFor a start date of ${process.argv[2]} (which timestamp = ${startDate}) the nearest block (within ${DELTA} seconds) is block: ${startBlock} (whose timestamp of ${startBlockTimestamp} is ${startBlockTimestamp - startDate} seconds away from target start date.)`,
      `\nFor an end date of ${process.argv[3]} (which timestamp = ${endDate}) the nearest block (within ${DELTA} seconds) is block: ${endBlock} (whose timestamp of ${endBlockTimestamp} is ${endBlockTimestamp - endDate} seconds away from target end date.)`
    )
    // process.exit(0)
    await getTransactionsByAccount("0x0bCAeeacf54D193bbe514607B4e35f5830587bF8", startBlock, endBlock)
    // let blockCount = await node.getBlockNumber()
    // console.log("get block count:", blockCount)
    // let filter = {
    //     address:  "0x0bCAeeacf54D193bbe514607B4e35f5830587bF8",
    //     fromBlock: startBlock,
    //     toBlock: endBlock,
    // }

    // node.on(filter, (log, event) => {
    //     console.log(log)
    // })

  } catch (e) {
    console.log("Error in main: ", e)
    process.exit(1)
  }
}


main().then(
  () => process.exit(),
  err => {
      console.error(err);
      process.exit(-1);
  },
);