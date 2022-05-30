import { View, Text, TouchableOpacity, Alert} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { profile } from '../../../logic/constant/env';
import * as Random from 'expo-random'
import { ethers } from 'ethers';
import CryptoES from 'crypto-es'
import * as FileSystem from 'expo-file-system'
import StyledInput from '../../components/StyledInput';
import StyledButton from '../../components/StyledButton';
import { useState } from 'react';
import * as Clipboard from 'expo-clipboard'
// import { RSA } from 'react-native-rsa-native';
// const RSA = require('react-native-rsa-native').RSA
const RSAKey = require('react-native-rsa')

export const AccountMenuScreen = () =>  {
    const navigator = useNavigation()
    return (
        <View style={styles.containner}>
            <AccountOption name='Register blockchain receipt service'
                            content={async ()=>{
                                let isEnrolled = await isMemberEnrolled()
                                if (!isEnrolled) {       
                                //     let registerSuccessfully = await registerService(profile.currentCustomer.id, "2222")
                                //     if (registerSuccessfully) {
                                //         console.warn("Register service successfully")
                                //     } else {
                                //         console.warn("Register failed")
                                //     }
                                // } else {
                                //     console.warn("User already enrolled in the service")
                                    navigator.navigate('Enter new passcode')

                                } else {
                                    console.warn("User has already enrolled in the contract")
                                }
                            }}/>
            <AccountOption name='Export private key'
                            content={async () => {
                                let data = await UnlockPrivateKey()
                                console.log("outer: data:", data)
                                navigator.navigate('Unlock private key', {
                                    information: data
                                })
                            }}/>
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

export const EnterNewPasscodeScreen = () => {
    const [passcode, setPasscode] = useState('')
    return (
        <View>
            <Text>Enter your new password....</Text>
            <StyledInput placeholer='Enter your new password here'
                            value={passcode}
                            setValue={setPasscode}/>
            <StyledButton type='primary'
                            title='Register service'
                            onPress={async ()=>{
                                if (passcode.length === 0) {
                                    Alert.alert("Please enter a passcode")
                                } else {
                                    try {
                                        // save passcode to a file
                                        let objToWrite = {
                                            "u": profile.currentCustomer.id,
                                            "p": passcode,
                                        }
                                    
                                        let stringToWrite = JSON.stringify(objToWrite)
                                    
                                        const path = FileSystem.documentDirectory + profile.currentCustomer.id + "inf.js"
                                        console.log('path:', path)
                                        await FileSystem.writeAsStringAsync(path, stringToWrite,{ encoding: FileSystem.EncodingType.UTF8 })

                                        let ok = await registerService(profile.currentCustomer.id, passcode)
                                        if (ok) {
                                            Alert.alert("Register successfully")
                                        } else {
                                            Alert.alert("An error occured when register service")
                                        }
                                    } catch (error) {
                                        Alert.alert("An unexpected error occurred")
                                        console.log("Error when registering:", error)
                                    }
                                }
                            }}/>
        </View>
    )
}

export const UnlockPrivateKeyScreen = (navigation) => {
    let information = navigation.route.params.information 
    const [passcode, setPasscode] = useState('')
    const navigator = useNavigation()
    return (
        <View>
            <Text>
                Enter your unlock passcode here...
            </Text>
            <StyledInput placeholer='Enter your password to unlock private key...'
                            value={passcode}
                            setValue={setPasscode}/>
            <StyledButton title='Unlock private key'
                            type='primary'
                            onPress={async ()=> {
                                if (passcode.length === 0) {
                                    console.warn("Please enter your passcode")
                                } else {
                                    if (passcode === information.p) {
                                        const privPath = FileSystem.documentDirectory + 'sample.json'
                                        let stringToDecrypt = await FileSystem.readAsStringAsync(privPath, { encoding: FileSystem.EncodingType.UTF8 } )
                                        console.log("in stringToDecrypt:", stringToDecrypt)
                                        let obj = JSON.parse(stringToDecrypt)
                                        const decrypted = CryptoES.AES.decrypt(obj.key, passcode).toString(CryptoES.enc.Utf8)
                                        navigator.navigate('Private key', {
                                            p: decrypted
                                        })
                                    } else {
                                        Alert.alert("Invalid passcode")
                                    }   
                                }
                            }}/>

        </View>
    )
}

const UnlockPrivateKey = async () => {
    console.log("Got here")
    const path = FileSystem.documentDirectory + profile.currentCustomer.id + "inf.js"
    const data = await FileSystem.readAsStringAsync(path,{ encoding: FileSystem.EncodingType.UTF8 } )
                            // .then(function(result) {
                            //     let obj = JSON.parse(result)
                            //     return obj
                            // }).catch(function(error) {
                            //     console.warn("An error occured:", error)
                            // })
    let obj = JSON.parse(data)
    console.log("data:", obj)
    return obj
    // const navigator = useNavigation()
    // navigator.navigate('Unlock private key', {
    //     information: data
    // })
    // console.log(customerInformation)
    // const [passcode, setPasscode] = useState('')
    // const navigator = useNavigation()
    // return (
    //     <View>
    //         {/* <StyledInput placeholer='Enter your new password here'
    //                         value={passcode}
    //                         setValue={setPasscode}/> */}
    //         {/* <StyledButton type='primary'
    //                         title='Get private key'
    //                         onPress={async ()=>{
    //                             if (passcode.length === 0) {
    //                                 Alert.alert("Please enter password")
    //                             } else {
    //                                 if (passcode === pwd) {
    //                                     const privPath = FileSystem.documentDirectory + 'sample.json'
    //                                     let stringToDecrypt = await FileSystem.readAsStringAsync(privPath, { encoding: FileSystem.EncodingType.UTF8 } )
    //                                     console.log("in stringToDecrypt:", stringToDecrypt)
    //                                     let obj = JSON.parse(stringToDecrypt)
    //                                     const decrypted = CryptoES.AES.decrypt(obj.key, passcode).toString(CryptoES.enc.Utf8)
    //                                     navigator.navigate('Private key', {
    //                                         p: decrypted
    //                                     })
    //                                 } else {
    //                                     Alert.alert("Invalid passcode")
    //                                 }   
    //                             }
    //                         }}/> */}
    //     </View>
    // )
}

export const PrivateKeyScreen = (navigation) => {
    const privateKey = navigation.route.params.p
    return (
        <View>
            <Text>
                Your private key:
            </Text>
            <Text>
                {privateKey}
            </Text>
            <StyledButton type='secondary'
                            title='Copy to clipboard'
                            onPress={() => {    
                                // Clipboard.setString(privateKey)
                                // console.warn("Copied to clipboard!")
                                Clipboard.setString(privateKey)
                                console.warn("Copied to clipboard!")
                            }} />
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
    // const node = new ethers.providers.InfuraProvider('maticmum', {
    //     projectId: "7d8f19d50b954a0fa348985e6079f108",
    //     projectSecret: "05a5c4239e914fef9b00bfecbd456a61",
    // })
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
    let customerPrivateKeyForSigning = newWallet.privateKey
    console.log("customerAddress:", customerAddress)
    console.log("customerPrivateKey:", customerPrivateKeyForSigning)
    // todo: save private key here
    // this is the private key for signing documents
    const encrypted = CryptoES.AES.encrypt(customerPrivateKeyForSigning, password).toString()
    console.log("encrypted:", encrypted)
    // try to save this to a file
    // we also need a private key for decrypting message from the server

    // RSA.generateKeys(4096).then(
    //     function(keys) {
    //         if (err != null) {
    //             throw err
    //         }
    //         pubKeyForEncrypting = keys.public
    //         privKeyForDecrypting = keys.private
    //         console.log("pair of pub/priv")
    //         console.log("=========\n public key", publicKey)
    //         console.log("=========\n private key", privateKey)
    //     }
    // )

    const rsa = new RSAKey()
    const bits = 4096
    const exponent = '10001'
    const r = rsa.generate(bits, exponent)
    let pubKeyForEncrypting = rsa.getPrivateString()
    let privKeyForDecrypting = rsa.getPublicString()
    
    let encryptedPrivKeyForDecrypting = CryptoES.AES.encrypt(privKeyForDecrypting, password).toString()

    // let objToWrite = {
    //     "key": encrypted,
    //     "decrypting": encryptedPrivKeyForDecrypting
    // }

    // let stringToWrite = JSON.stringify(objToWrite)

    // const path = FileSystem.documentDirectory + 'sample.json'
    // console.log('path:', path)
    // await FileSystem.writeAsStringAsync(path, stringToWrite,{ encoding: FileSystem.EncodingType.UTF8 })
    // let stringToDecrypt = await FileSystem.readAsStringAsync(path,{ encoding: FileSystem.EncodingType.UTF8 } )
    // console.log("stringToDecrypt:", stringToDecrypt)
    // let obj = JSON.parse(stringToDecrypt)
    // const decrypted = CryptoES.AES.decrypt(obj.key, password).toString(CryptoES.enc.Utf8)
    // console.log("decrypted:", decrypted)
    // return
    try {
        result = await profile.connector.registerBlockchainReceiptService(customerID, customerAddress, pubKeyForEncrypting)
                    .then(async function(response){
                        console.log(response)
                        if (response.status == "success") {
                            console.log("===============\n", response)
                            let objToWrite = {
                                "key": encrypted,
                                "decrypting": encryptedPrivKeyForDecrypting,
                                "bank_public_key": response.details.bank_public_key
                            }
                        
                            let stringToWrite = JSON.stringify(objToWrite)
                        
                            const path = FileSystem.documentDirectory + 'sample.json'
                            console.log('path:', path)
                            await FileSystem.writeAsStringAsync(path, stringToWrite,{ encoding: FileSystem.EncodingType.UTF8 })
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

    // const node = new ethers.providers.InfuraProvider('maticmum', {
    //     projectId: "7d8f19d50b954a0fa348985e6079f108",
    //     projectSecret: "05a5c4239e914fef9b00bfecbd456a61",
    // })
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