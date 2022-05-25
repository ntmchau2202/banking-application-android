const CONTRACT_ABI = require('./bankFactory.json')
const ethers = require('ethers')

const node = new ethers.providers.WebSocketProvider("https://speedy-nodes-nyc.moralis.io/f2b19a3c16403baa4483c731/polygon/mumbai/archive")
let blockchainClient = new ethers.Contract("0xc568117c255dc610fb44E432B3E96D72f2A488e6", CONTRACT_ABI, node)

let result = blockchainClient.findUser("N-0001").then(function(result){
    console.log(result)
    return result
}).catch(function(error){
    console.log(error)
})
