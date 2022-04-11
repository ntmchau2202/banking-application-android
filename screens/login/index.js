import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StyledButton from '../../components/StyledButton';
import StyledInput from '../../components/StyledInput';
import styles from './styles.js'

import Popup from '../../components/Popup';

// import StyledButton from './components/StyledButton';

export const LoginScreen = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loginOK, toggleWarning] = useState(false);
    const [loginContent, setLoginContent] = useState('')
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

            <Popup
                value={loginOK}
                content={loginContent}
                onPress={toggleWarning}
            ></Popup>
            
            <StyledButton
                type='primary'
                title='Login'
                onPress={()=>{
                    if (Login(phone, password) === true) {
                        toggleWarning(true)
                        setLoginContent('Login OK')
                    } else {    
                        toggleWarning(true)
                        setLoginContent('Login failed')
                    }
                }}>
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
    return true

}
