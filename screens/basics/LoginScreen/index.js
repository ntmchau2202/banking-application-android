import React, { useState } from 'react';
import { View } from 'react-native';
// import StyledButton from '../../components/StyledButton';
// import StyledInput from '../../components/components/StyledInput';
import StyledButton from '../../components/StyledButton/index.js';
import StyledInput from '../../components/StyledInput/index.js'
import styles from './styles.js'
import { useNavigation } from '@react-navigation/native';

const Client = require('../../../logic/entities/client').Client


// import Popup from '../../components/components/Popup';
import Popup from '../../components/Popup'
import { profile } from '../../../logic/constant/env.js';


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
                onPress={()=> {
                    const client = new Client()
                    // const client = Client()
                    profile.connector = client
                    profile.connector.login(phone, password)
                    .then(function(result) {
                        if ('error' in result) {
                            toggleWarning(true)
                            setLoginContent('Login failed')
                        } else {
                            // TODO: CREATE CUSTOMER INSTANCE HERE!
                            profile.currentCustomer = result
                            navigation.navigate('Main menu', {
                                name: result.id,
                                content: result.name,
                            })
                        }
                    }).catch(function(error){
                        toggleWarning(true)
                        setLoginContent('Login failed')
                    })
                    
                    // if (Login(phone, password) === true) {
                    //     navigation.navigate('Main menu', {
                    //         name: 'N-0001',
                    //         content: 'Chou Chou',
                    //     })
                    // } else {    
                    //     toggleWarning(true)
                    //     setLoginContent('Login failed')
                    // }
                }}>
            </StyledButton>
        </View>
    )
}
