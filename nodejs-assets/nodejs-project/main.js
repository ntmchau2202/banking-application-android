var rn_bridge = require('rn-bridge');

const Moralis = require('moralis/node')

// Moralis stuffs here

function broadcastToIPFS(type, objectToSend) {
    console.log("Attempting to broadcast...")
    let currentTime = new Date().getDate().toString()
    // let object = {
    //     "time_created": currentTime,
    //     "type": "create",
    //     "customer_signature": signature,
    //     "receipt": encryptedReceipt
    // }
    let jsonString = JSON.stringify(objectToSend)

    // let contentBuffer = Buffer.from(jsonString)
    // let base64String = btoa(jsonString)
    let base64String = base64.encode(jsonString)

    let prefix = ""
    if (type == "settle") {
        prefix = "settle_"
    } else if (type == "create") {
        prefix = "create_"
    }
    let fileName = prefix + currentTime + ".json"
    console.log("Awaiting upload...")
    await Moralis.start({serverUrl: profile.ipfsNodeLink,
                        appId: profile.ipfsAppID,
                        masterKey: profile.ipfsMasterKey})
    const moralisFile = new Moralis.File(fileName, {base64: base64String}, 'application/json')
    const result = await moralisFile.saveIPFS({useMasterKey: true})
    return result._hash
}

// Echo every message received from react-native.
rn_bridge.channel.on('message', (msg) => {
    // do Moralis stuff
    let ipfsHash = broadcastToIPFS(msg.type, msg.objectToSend)
    rn_bridge.channel.send(ipfsHash);
} );

// Inform react-native node is initialized.
rn_bridge.channel.send("Node was initialized.");