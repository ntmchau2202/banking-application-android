import React from 'react';
import { FlatList, View } from 'react-native';
import styles from './styles.js'
// import { OpenTransaction, SettleTransaction } from './transaction';
import { OpenTransaction, SettleTransaction } from './transaction.js';

const TransactionItem = (props) => {
    const txnType = props.txn.name 
    if (txnType === 'Open account') {
        return new OpenTransaction(props).render('Transaction details')
    } else if (txnType === 'Settle account') {
        return new SettleTransaction(props).render('Transaction details')
    }
}

const TransactionList = (props) => {
    return (
        <View style={styles.container}>
            <FlatList 
             data={props.content}
             renderItem={({item}) => <TransactionItem txn={item}/>}
             keyExtractor={item => item.txnHash}/>
        </View>
    )
}

export default TransactionList