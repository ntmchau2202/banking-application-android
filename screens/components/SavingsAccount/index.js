import React from 'react';
import { FlatList, View, Text} from 'react-native';
import  SavingsAccount  from './savingsaccount.js'
import styles from './styles.js'

const SavingsAccountItem = (props) => {
    return (
        new SavingsAccount(props).render('Savings account details')
    )
}

const SavingsAccountList = (props) => {
    console.log("txnList props:", props)
    return (
        <View style={styles.container}>
            <FlatList 
             data={props.content}
             renderItem={({item}) => <SavingsAccountItem txn={item}/>}
             keyExtractor={item => item.txnHash}/>
        </View>
    )
}

export default SavingsAccountList