// import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator }from '@react-navigation/native-stack';
import TransactionDetails from './screens/TransactionDetailsScreen';
import { TransactionConfirmation } from './screens/TransactionDetailsScreen';

import StyledButton from './components/StyledButton';
import StyledInput from './components/StyledInput'

import {Login, LoginScreen} from './screens/LoginScreen/index'
import MainScreen from './screens/TransactionScreen/index';
import MainMenu from './screens/MainMenuScreen';
import TransactionListScreen from './screens/TransactionScreen/index';
import PendingTransactionScreen from './screens/PendingTransactionScreen';

const Stack = createNativeStackNavigator();

const WelcomeScreen = ({navigation}) => {

  return ( 
    <View style={styles.buttonContainer}>
       <View style={styles.container}>
        <StyledButton
          type='primary'
          title={'Login'}
          onPress={()=> {
            navigation.navigate('Login')
          }}/>

        <StyledButton
        type='secondary'
        title={'Create new account'}
        onPress={() => {
        }}
        />

      </View>
    </View>
    // <View>
    //       <MainMenu content='Chou chou'
    //           name='N-0123'/>
    // </View>

    
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
        <Stack.Screen component={MainMenu}
                      name='Main menu'/>
        <Stack.Screen component={TransactionListScreen}
                      name='Transaction list'/>
        <Stack.Screen component={TransactionDetails}
                      name='Transaction details'/>
        <Stack.Screen component={PendingTransactionScreen}
                      name='Pending transaction'/>
        <Stack.Screen component={TransactionConfirmation}
                      name='Confirm transaction'/>
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
