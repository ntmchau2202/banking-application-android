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

export const TransactionDetails = (props) => {
    const txnType = props.txn.name 
    if (txnType === 'Open account') {

    } else if (txnType === 'Settle account') {

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
        // <Card>
        //     <Card.Title>List of transactions</Card.Title>
        //     <Card.Divider/>
        //     {
        //         txns.map((v, k) => {
        //             return (
        //                 <View key={k} style={styles.txnContainer}>
        //                     <Text style={styles.text}>
        //                         Type: {tuple.name}
        //                     </Text>
        //                     <Text style={styles.text}>    
        //                         Transaction Hash: {tuple.txnHash} 
        //                     </Text>
        //                 </View>
        //             )
        //         })
        //     }
        // </Card>
    )
}

export default TransactionList