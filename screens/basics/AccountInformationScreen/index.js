import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { profile } from '../../../logic/constant/env';
import StyledInput from "../../components/StyledInput";
import StyledButton from '../../components/StyledButton';
// import 'react-native-get-random-values';
import * as Random from 'expo-random'
// import 'ethers/dist/shims.js';
import { ethers } from 'ethers';
import { entropyToMnemonic } from 'ethers/lib/utils';
export const AccountMenuScreen = () =>  {
    return (
        <View style={styles.containner}>
            <AccountOption name='Register blockchain receipt service'
                            content={async ()=>{
                                let isEnrolled = await isMemberEnrolled()
                                if (!isEnrolled) {   
                                    let registerSuccessfully = await registerService()
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
                            content=''/>
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

const registerService = async (customerID) => {
    console.log("Get into register service")
    let result = null 
    // create a new wallet 
    const newWallet = await createRandomWallet()
    let customerAddress = newWallet.address
    let customerPrivateKey = newWallet.privateKey
    console.log("customerAddress:", customerAddress)
    console.log("customerPrivateKey:", customerPrivateKey)
    // todo: save private key here
    try {
        result = profile.connector.registerBlockchainReceiptService(customerID, customerAddress)
                    .then(function(response){
                        console.log(response)
                        if (response.status == "success") {
                            return true
                        } else {
                            return false
                        }
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