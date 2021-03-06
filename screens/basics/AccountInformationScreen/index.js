import { View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { profile } from '../../../logic/constant/env';
import * as Random from 'expo-random'
import { ethers } from 'ethers';
import CryptoES from 'crypto-es'
import * as FileSystem from 'expo-file-system'

export const AccountMenuScreen = () =>  {
    return (
        <View style={styles.containner}>
            <AccountOption name='Register blockchain receipt service'
                            content={async ()=>{
                                let isEnrolled = await isMemberEnrolled()
                                if (!isEnrolled) {   
                                    let registerSuccessfully = await registerService(profile.currentCustomer.id, "2222")
                                    if (registerSuccessfully) {
                                        console.warn("Register service successfully")
                                    } else {
                                        console.warn("Register failed")
                                    }
                                } else {
                                    console.warn("User already enrolled in the service")
                                }
                            }}/>
            <AccountOption name='Export private key'
                            content=''/>
            <AccountOption name='Export passphrase'
                            content=''/>
            <AccountOption name='Change password'
                            content=''/>
            <AccountOption name='Change basic information'
                            content=''/>
            <AccountOption name='Logout'
                            content=''/>
            <AccountOption name='Deactive account'
                            content={async ()=>{
                                let isEnrolled = await isMemberEnrolled()
                                if (isEnrolled) {
                                    let success = await deactivateAccount()
                                    if (success) {
                                        console.warn("Deactivate account successfully")
                                    } else {
                                        console.warn("Deactivate account failed")
                                    }
                                } else {
                                    console.warn("User didn't enrolled in the service")
                                }
                            }}/>
        </View>
    )
}

const isMemberEnrolled = async () => {
    let result = null
    try {
        result = profile.connector.isCustomerEnrolled(profile.currentCustomer.id)
        .then(function(response) {
            console.log("response:", response)
            return response
        }).catch(function (error) {
            throw error
        })
    } catch (error) {
        console.log(error)
        throw error
    } 
    return result
}

const createRandomWallet = async () => {
    const randomBytes = await Random.getRandomBytesAsync(32);
    // console.log("random Bytes:", randomBytes)
    const hdNode = ethers.utils.HDNode.fromSeed(randomBytes)
    const privateKey = hdNode.privateKey
    const addr = hdNode.address
    // connect to node provider
    console.log("private Key:", privateKey)
    console.log("address:", addr)
    const node = new ethers.providers.WebSocketProvider("wss://speedy-nodes-nyc.moralis.io/f2b19a3c16403baa4483c731/polygon/mumbai/ws")
    const wallet = new ethers.Wallet(privateKey, node)
    return wallet
}

const registerService = async (customerID, password) => {
    console.log("Get into register service")
    let result = null 
    // create a new wallet 
    const newWallet = await createRandomWallet()
    let customerAddress = newWallet.address
    let customerPrivateKey = newWallet.privateKey
    console.log("customerAddress:", customerAddress)
    console.log("customerPrivateKey:", customerPrivateKey)
    // todo: save private key here
    const encrypted = CryptoES.AES.encrypt(customerPrivateKey, password).toString()
    console.log("encrypted:", encrypted)
    // try to save this to a file
    let objToWrite = {
        "key": encrypted,
    }

    let stringToWrite = JSON.stringify(objToWrite)

    const path = FileSystem.documentDirectory + 'sample.json'
    console.log('path:', path)
    await FileSystem.writeAsStringAsync(path, stringToWrite,{ encoding: FileSystem.EncodingType.UTF8 })
    let stringToDecrypt = await FileSystem.readAsStringAsync(path,{ encoding: FileSystem.EncodingType.UTF8 } )
    console.log("stringToDecrypt:", stringToDecrypt)
    let obj = JSON.parse(stringToDecrypt)
    const decrypted = CryptoES.AES.decrypt(obj.key, password).toString(CryptoES.enc.Utf8)
    console.log("decrypted:", decrypted)
    // return
    try {
        result = profile.connector.registerBlockchainReceiptService(customerID, customerAddress)
                    .then(function(response){
                        console.log(response)
                        if (response.status == "success") {
                            return true
                        } else {
                            return false
                        }
                    }).catch(function(error) {
                        throw error
                    })
    } catch (error) {
        throw error
    }
    return result
}

const deactivateAccount = async () => {
    // load wallet and get address

    const path = FileSystem.documentDirectory + 'sample.json'
    let stringToDecrypt = await FileSystem.readAsStringAsync(path,{ encoding: FileSystem.EncodingType.UTF8 } )
    console.log("stringToDecrypt:", stringToDecrypt)
    let obj = JSON.parse(stringToDecrypt)
    const decrypted = CryptoES.AES.decrypt(obj.key, password).toString(CryptoES.enc.Utf8)
    console.log("decrypted:", decrypted)

    const node = new ethers.providers.WebSocketProvider("wss://speedy-nodes-nyc.moralis.io/f2b19a3c16403baa4483c731/polygon/mumbai/ws")
    const wallet = new ethers.Wallet(decrypted, node)
    const addr = wallet.address
    let result = null
    try {
        result = profile.connector.deactivateAccount(addr)
                    .then(function(response) {
                        if(response.status == "success") {
                            return true
                        } else {
                            return false
                        }
                    }).catch(function(error) {
                        throw error
                    })
    } catch (error) {
        throw error
    }
    
    return result

}

export const AccountOption = (props) => {
    const navigation = useNavigation()
    const fn = props.content
    return (
        <TouchableOpacity style={styles.containner}
                            onPress={() => {
                                fn()
                            }}>
            <Text style={styles.text}>
                {props.name}
            </Text>
        </TouchableOpacity>
    )
}

// export const AccountDetails = (props) => {
//     return (
//         <View style={styles.accountDetailContainer}>
//             <Image style={styles.accountAvatar}/>
//             <AccountDetailSection name='Name'
//                                 content='Chou chou'/>
//             <AccountDetailSection name='Phone'
//                                 content='0123456789'/>
//             <AccountDetailSection name='Join date'
//                                 content='12/03/2022'/>
//             <AccountDetailSection name='Number of transactions'
//                                 content='14'/>
//         </View>
//     )
// }

const AccountDetailSection = (props) => {
    return (
        <View>
            <Text style={styles.accountDetailsText}>
                {props.name}
            </Text>
            <Text style={styles.accountDetailsText}>
                {props.details}
            </Text>
        </View>
    )
}