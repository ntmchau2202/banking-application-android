import React, { useState } from 'react';
import { Text, View, TouchableOpacity, FlatList} from 'react-native';
// import StyledButton from '../../components/components/StyledButton';
// import StyledInput from '../../components/components/StyledInput';
import StyledButton from '../../components/StyledButton/index.js';
import StyledInput from '../../components/StyledInput/index.js';
import styles from './styles.js'
import { useNavigation } from '@react-navigation/native';
import { FieldMap } from './fieldmap';

const TableColumnTitle = (props) => {
    return ( 
        // <View style={styles.tableColumnTitle}>
        <View>
            <Text styles={styles.tableColumnTitleText}>
                {props.name}
            </Text>
        </View>
    )
}

const TableColumnContent = (props) => {
    return ( 
        // <View style={styles.tableColumnContent}>
        <View>
            <Text style={styles.tableColumnContentText}>
                {props.content}
            </Text>
        </View>
    )
}

const TableRowAttribute = (props) => {
    return (
        <TouchableOpacity style={styles.tableRow}>
            <TableColumnTitle name={props.name}/>
            <TableColumnContent content={props.content}/>
        </TouchableOpacity>
    )
}



const SavingsAccountDetails = (navigation) => {
    const navigator = useNavigation()
    console.log("account:", navigation.route.params)
    let originalObj = navigation.route.params
    const mapProps = Object.entries(originalObj).map(([k, v]) => ({key: FieldMap[k], value: v}))
    let needBtn = false 
    let btnTitle = ''
    let btnScreenNavigation = ''
    let currentSavingsStatus = navigation.route.params.status
    console.log(navigation.route.params.status)
    console.log("current savings status:", currentSavingsStatus)
    let informationObject = null
    if (currentSavingsStatus === 1) {
        needBtn = true 
        btnTitle = 'Confirm creation'
        btnScreenNavigation = 'Confirm creation'
        informationObject = {
            // route.params at this moment will have all information for creation confirmation
            source: {
                id: originalObj.bankAccountID,
            },
            savingsAmount: originalObj.savingsAmount,
            savingsAccountID: originalObj.savingsAccountID,
            currency: originalObj.currency,
            savingsPeriod: originalObj.savingsPeriod,
            interestRate: originalObj.interestRate,
            estimatedInterestAmount: originalObj.estimatedInterestAmount,
            settleInstruction: originalObj.settleInstruction,
            openTime: originalObj.openTime
        }
    } else if (currentSavingsStatus === 2) {
        needBtn = true 
        btnTitle = 'Settle'
        btnScreenNavigation = 'Confirm settle'
        informationObject = originalObj
    } else if (currentSavingsStatus === 3) {
        needBtn = true 
        btnTitle = 'Confirm settle'
        btnScreenNavigation = 'Confirm settle'
        informationObject = {
            savingsAmount: originalObj.savingsAmount,
            interestRate: originalObj.interestRate,
            currency: originalObj.currency,
            actualInterestAmount: originalObj.actualInterestAmount,
            settleTime: originalObj.settleTime,  
            savingsAccountID: originalObj.savingsAccountID,
        }
    } else if (currentSavingsStatus === 4) {
        needBtn = false
    }
    return (
        // <View style={styles.container}> 
            <View style={styles.tableContainer}>
                <FlatList
                    data={mapProps}
                    renderItem={({item}) => <TableRowAttribute 
                                                    name={item.key}
                                                    content={item.value}/>}></FlatList>
                {needBtn ? <View style={styles.confirmationButton}> 
                                <StyledButton type='primary'
                                  title={btnTitle}
                                  onPress={() => {
                                    navigator.navigate(btnScreenNavigation, informationObject)
                                  }}/>
                            </View> : null }
            </View>
        // </View>
    )
}

export const TransactionConfirmation = (navigation) => {
    const txnDetails = TransactionDetails(navigation)
    return (
        <View style={styles.confirmationContainer}>
            <View style={styles.confirmationInfo}>
                {txnDetails}
            </View>
            <View style={styles.confirmationButton}>
            <StyledButton type='primary'
                    title='Confirm'
                    onPress=''
                    />
            <StyledButton type='secondary' 
                        title='Decline'
                        onPress=''/>
            </View>
            
            

        </View>
    )
}

export default SavingsAccountDetails 
