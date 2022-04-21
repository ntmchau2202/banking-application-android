import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StyledButton from '../../components/StyledButton';
import StyledInput from '../../components/StyledInput';
import styles from './styles.js'

// import StyledButton from './components/StyledButton';

export const SignupScreen = () => {
    return (
        <View 
            style={styles.container}> 

        <StyledInput
         placeholder={'Your phone'}
         type='number'
         content='phone' >
        </StyledInput>

        <StyledInput
          placeholder={'Password'}
          type='normal'
          content='password'>

        </StyledInput>
        <StyledButton
            type='primary'
            title='Sign up'
            onPress={()=>Signup(this.state.phone, this.state.password)}>
        </StyledButton>
        </View>
    )
}

export function Signup (
    phone,
    password,
) {
    // try to login....
    console.warn("Trying to sign up..." + {phone} + {password})
}
