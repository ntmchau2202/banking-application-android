import React from 'react';
import { View } from 'react-native';
import { SearchBar } from 'react-native-elements';

import TransactionList from '../../components/Transaction';


const TransactionListScreen = (navigation) => {
    return(
        <View>
            <SearchBar placeholder='Enter bank account here...'/>
            <TransactionList content={navigation.route.params}/>
        </View>
    )
}

const search = (key) => {

}




export default TransactionListScreen