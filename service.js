import Moralis from "moralis/node.js";
import { config } from "./config.js";

export async function postReceipt(requestedObject) {
    const type = requestedObject.type 
    var prefix = ''
    if (type === "settle") {
        prefix = "settle_"
    } else if (type == "create") {
        prefix = "create_"
    }

    let fileName = prefix + requestedObject.time_created + ".json"
    const str = JSON.stringify(requestedObject)
    const base64String = btoa(str)
    await Moralis.start({serverUrl: config.ipfsNodeLink,
                        appId: config.ipfsAppID,
                        masterKey: config.ipfsMasterKey})
    const moralisFile = new Moralis.File(fileName, {base64: base64String}, 'application/json')
    const result = await moralisFile.saveIPFS({useMasterKey: true})
    console.log(result._hash)
    return result._hash
}

