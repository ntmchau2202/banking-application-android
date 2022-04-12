import React from 'react';
import { FlatList, View } from 'react-native';
import styles from './styles.js'
import txns from './txn'
import { OpenTransaction, SettleTransaction } from './transaction';

const TransactionItem = (props) => {
    const txnType = props.txn.name 
    if (txnType === 'Open account') {
        return new OpenTransaction(props).render()
    } else if (txnType === 'Settle account') {
        return new SettleTransaction(props).render()
    }
}

const TransactionList = () => {
    return (
        <View style={styles.container}>
            <FlatList 
             data={txns}
             renderItem={({item}) => <TransactionItem txn={item}/>}
             keyExtractor={item => item.txnHash}/>
        </View>
    )
}

export default TransactionList