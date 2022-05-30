import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import StyledInput from "../../components/StyledInput";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import styles from './styles'
// import {period, currency, settleStrategy} from './periods'
import { useState } from "react";
import StyledButton from "../../components/StyledButton";
import { useNavigation } from "@react-navigation/native";
// import { Client } from "../../../logic/entities/client";
const Client = require("../../../logic/entities/client").Client
const profile = require("../../../logic/constant/env").profile

function calculateActualInterestAmount(savingsAmount, interestRate, openTimeString) {
    console.log(savingsAmount, interestRate, openTimeString)
    let currentTime = new Date()
    let openTime = new Date(openTimeString)
    const diffTime = Math.abs(currentTime - openTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    const actualInterestAmount = savingsAmount * (interestRate/100) * (diffDays/365)
    return actualInterestAmount
}


const ConfirmSettleScreen = (navigation) => {
    let actualInterestAmount = 0
    console.log("information:", navigation.route.params)
    if (!'actualInterestAmount' in navigation.route.params || navigation.route.params.actualInterestAmount === 0 || navigation.route.params.actualInterestAmount == null) {
        console.log("going to calculate stuffs")
        actualInterestAmount = calculateActualInterestAmount(navigation.route.params.savingsAmount,
            navigation.route.params.interestRate,
            navigation.route.params.openTime)
    } else {
        actualInterestAmount = navigation.route.params.actualInterestAmount
    }
    console.log('actual interest amount:', actualInterestAmount)
    let currentTime = null 
    if ('settleTime' in navigation.route.params && navigation.route.params.settleTime != null) {
        currentTime = navigation.route.params.settleTime
    } else {
        currentTime = new Date().toUTCString()
    }   
    console.log('current time:', currentTime)

    return(
        <View style={styles.container}>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Savings account ID</Text>
                <Text style={styles.orderDetails}>{navigation.route.params.savingsAccountID}</Text>
            </View>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Savings amount</Text>
                <Text style={styles.orderDetails}>{navigation.route.params.savingsAmount}</Text>
            </View>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Interest rate (%)</Text>
                <Text style={styles.orderDetails}>{navigation.route.params.interestRate}</Text>
            </View>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Actual interest amount</Text>
                <Text style={styles.orderDetails}>{actualInterestAmount}</Text>
            </View>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Currency</Text>
                <Text style={styles.orderDetails}>{navigation.route.params.currency}</Text>
            </View>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Settle time</Text>
                <Text style={styles.orderDetails}>{currentTime}</Text>
            </View>
            <StyledButton type='primary'
                            title='Confirm'
                            onPress={async () => {
                                console.warn("going to settle account")
                                // const client = new Client()
                                // profile.connector = client
                               
                                let message = {
                                    "customer_phone": profile.currentCustomer.phone,
                                    "actual_interest_amount": actualInterestAmount,
                                    "settle_time": currentTime,  
                                    "savingsaccount_id": navigation.route.params.savingsAccountID,
                                }

                                let connector = new Client()

                                await connector.requestSettleAccount(message).then(function(response){
                                    if (typeof(response) === 'object') {
                                        if ('error' in response) {
                                            console.warn("An error occured when creating new account")
                                            console.log(response)
                                        } 
                                    } else {
                                        console.warn("Account settled successfully")
                                    }
                                })
                            }}/>
            {/* <StyledButton type='secondary'
                            title='Go back'
                            onPress={() => {
                                navigator.navigate('Savings list')
                            }}/> */}
        </View>
    )
}

export default ConfirmSettleScreen