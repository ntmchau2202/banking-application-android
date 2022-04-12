import React, { useState } from 'react';
import { View, FlatList} from 'react-native';
import StyledButton from '../../components/StyledButton';
import StyledInput from '../../components/StyledInput';
import styles from './styles.js'
import { useNavigation } from '@react-navigation/native';


const TableColumnTitle = (props) => {
    return ( 
        <View style={styles.tableColumnTitle}>
            <Text styles={styles.tableColumnTitleText}>
                {props.name}
            </Text>
        </View>
    )
}

const TableColumnContent = (props) => {
    return ( 
        <View style={styles.tableColumnContent}>
            <Text style={styles.tableColumnContentText}>
                {props.content}
            </Text>
        </View>
    )
}

const TableRowAttribute = (props) => {
    return (
        <View style={styles.tableRow}>
            <TableColumnTitle name={props.name}/>
            <TableColumnContent content={props.content}/>
        </View>
    )
}



const TransactionDetails = (props) => {
    return (
        <View style={styles.container}> 
            <View style={styles.tableContainer}>
                <FlatList
                    data={prop}
                    renderItem={({item}) => <TableRowAttribute 
                                                    name={item.name}
                                                    content={item.content}/>}></FlatList>
            </View>
        </View>
    )
}

export default TransactionDetails 