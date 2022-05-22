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
    let listSavingsAccount = []
    for (let i = 0; i < props.content.length; i++) {
        listSavingsAccount = listSavingsAccount.concat(props.content[i].savingsAccounts)
        for (let k = 0; k < props.content[i].length; k++) {
        }
    }

    return (
        <View style={styles.container}>
            <FlatList 
            //  data={props.content}
            data={listSavingsAccount}
            renderItem={({item}) => <SavingsAccountItem txn={item}/>}
            keyExtractor={item => item.txnHash}/>
        </View>
    )
}

export default SavingsAccountList