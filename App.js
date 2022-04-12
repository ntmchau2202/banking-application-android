// import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator }from '@react-navigation/native-stack';


import StyledButton from './components/StyledButton';
import StyledInput from './components/StyledInput'

import {Login, LoginScreen} from './screens/login/index'
import MainScreen from './screens/main/index';

const Stack = createNativeStackNavigator();

const WelcomeScreen = ({navigation}) => {
  let props = {
    name: "Hi",
    age: 18,
  }

  const mapProps = Object.entries(props).map(([key, val]) => ({key: key, val: val}))
  console.log(mapProps)

  return ( 
    <View style={styles.buttonContainer}>
       <View style={styles.container}>
        <StyledButton
          type='primary'
          title={'Login'}
          onPress={()=> {
            // console.warn("Logging in");
            navigation.navigate('Login')
          }}/>

        <StyledButton
        type='secondary'
        title={'Create new account'}
        onPress={() => {
          // console.warn("Create a new account")
        }}
        />

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
        <Stack.Screen component={MainScreen}
                      name='Main screen'/>
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

// registerRootComponent(App);
