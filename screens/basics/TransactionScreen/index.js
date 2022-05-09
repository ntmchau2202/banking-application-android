import React from 'react';
import { View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { profile } from '../../../logic/constant/env';
import SavingsAccountList from '../../components/SavingsAccount';
import SavingsAccount from '../../components/SavingsAccount/savingsaccount';

// import TransactionList from '../../components/components/Transaction';
import TransactionList from '../../components/Transaction';


const SavingsListScreen = (navigation) => {
    return(
        <View>
            <SearchBar placeholder='Enter bank account here...'/>
            {/* <TransactionList content={navigation.route.params}/> */}
            <SavingsAccountList content={profile.currentCustomer.bankAccounts[0].savingsAccounts} />
        </View>
    )
}

const search = (key) => {

}




export default SavingsListScreen