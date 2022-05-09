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
    const mapProps = Object.entries(navigation.route.params).map(([k, v]) => ({key: FieldMap[k], value: v}))
    return (
        // <View style={styles.container}> 
            <View style={styles.tableContainer}>
                <FlatList
                    data={mapProps}
                    renderItem={({item}) => <TableRowAttribute 
                                                    name={item.key}
                                                    content={item.value}/>}></FlatList>
                <View style={styles.confirmationButton}>
                    <StyledButton type='primary'
                                  title='Settle'
                                  onPress=''/>
                </View>
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
