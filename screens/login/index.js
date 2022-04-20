import React, { useState } from 'react';
import { View } from 'react-native';
import StyledButton from '../../components/StyledButton';
import StyledInput from '../../components/StyledInput';
import styles from './styles.js'
import { useNavigation } from '@react-navigation/native';


import Popup from '../../components/Popup';


export const LoginScreen = (props) => {
    const navigation = useNavigation();
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
                        navigation.navigate('Main menu', {
                            name: 'N-0001',
                            content: 'Chou Chou',
                        })
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
