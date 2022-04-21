import React from 'react';
import { View, FlatList} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { OpenTransaction, SettleTransaction } from '../../components/Transaction/transaction';
import TransactionList from '../../components/Transaction';
import styles from './styles';
// import txns from './txn'

const PendingTransactionItem = (props) => {
    const txnType = props.txn.name 
    if (txnType === 'Open account') {
        return new OpenTransaction(props).render('Confirm transaction')
    } else if (txnType === 'Settle account') {
        return new SettleTransaction(props).render('Confirm transaction')
    }
}

const PendingTransactionList = (props) => {
    return (
        <View style={styles.container}>
            <FlatList 
             data={props.content}
             renderItem={({item}) => <PendingTransactionItem txn={item}/>}
             keyExtractor={item => item.txnHash}/>
        </View>
    )
}

const PendingTransactionScreen = (navigation) => {
    return(
        <View>
            <PendingTransactionList content={navigation.route.params}/>
        </View>
    )
}

export default PendingTransactionScreen

