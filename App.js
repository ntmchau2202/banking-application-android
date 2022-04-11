import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator }from '@react-navigation/native-stack';


import StyledButton from './components/StyledButton';
import StyledInput from './components/StyledInput'

import {Login, LoginScreen} from './screens/login/index'

const Stack = createNativeStackNavigator();

const WelcomeScreen = ({navigation}) => {
  return ( 
    <View style={styles.buttonContainer}>
       <View style={styles.container}>
        <StyledButton
          type='primary'
          title={'Login'}
          onPress={()=> {
            console.warn("Logging in");
            navigation.navigate('Login')
          }}/>

        <StyledButton
        type='secondary'
        title={'Create new account'}
        onPress={() => {
          console.warn("Create a new account")

        }}
        />

        {/* <StyledInput
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
            title='Login'
            onPress={()=>Login(this.state.phone, this.state.password)}>
        </StyledButton> */}

      </View>
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen component={WelcomeScreen} 
                      name='Welcome screen'/>
        <Stack.Screen component={LoginScreen}
                      name='Login'/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonContainer: {
   position: 'absolute',
   bottom: 80,
   width: '100%',
  }
});
