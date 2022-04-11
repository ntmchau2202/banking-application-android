import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator }from '@react-navigation/native-stack';

import StyledButton from '../../components/StyledButton';
import StyledInput from '../../components/StyledInput';
import TransactionList from '../../components/Transaction';

const Stack = createNativeStackNavigator();

const MainScreen = (props) => {
    return(
        <View>
            <TransactionList/>
        </View>
    )
}




export default MainScreen