import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StyledButton from '../../components/StyledButton';
import StyledInput from '../../components/StyledInput';
import styles from './styles.js'

// import StyledButton from './components/StyledButton';

export const LoginScreen = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View 
            style={styles.container}> 

            <StyledInput
                placeholder={'Your phone'}
                type='number'
                value={phone}
                setValue={setPhone}>
            </StyledInput>

            <StyledInput
                placeholder={'Password'}
                value={password}
                setValue={setPassword}
                type='password'>
            </StyledInput>
            
            <StyledButton
                type='primary'
                title='Login'
                onPress={()=>Login(
                    phone,
                    password
                )}>
            </StyledButton>
        </View>
    )
}

export function Login (
    phone,
    password,
) {
    // try to login....
    console.log("Trying to login..." + phone + " " + password)
}
