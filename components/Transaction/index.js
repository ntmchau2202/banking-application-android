import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import {Card} from '@rneui/base'
import StyledButton from '../../components/StyledButton';
import StyledInput from '../../components/StyledInput';
import styles from './styles.js'
import txns from './txn'
import { render } from 'react-dom';


const TransactionItem = (props) => {
    const txnType = props.txn.name 
    let tuple = props.txn
    console.log(tuple)
    return (
        <View style={styles.txnContainer}>
            <Text style={styles.text}>
                Type: {tuple.name}
            </Text>
            <Text style={styles.text}>    
                Transaction Hash: {tuple.txnHash} 
            </Text>
        </View>
    )
}

function renderItem(item) {
    return( 
        <Card/>
    )
}

const TransactionList = () => {
    return (
        // <View style={styles.container}>
        //     <FlatList 
        //      data={txns}
        //      renderItem={({item}) => <TransactionItem txn={item}/>}
        //      keyExtractor={item => item.txnHash}/>
        // </View>
        <Card>
            <Card.Title>List of transactions</Card.Title>
            <Card.Divider/>
            {
                txns.map((v, k) => {
                    return (
                        <View key={k} style={styles.txnContainer}>
                            <Text style={styles.text}>
                                Type: {tuple.name}
                            </Text>
                            <Text style={styles.text}>    
                                Transaction Hash: {tuple.txnHash} 
                            </Text>
                        </View>
                    )
                })
            }
        </Card>
    )
}

export default TransactionList