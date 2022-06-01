// import { registerRootComponent } from 'expo';
import { StyleSheet,  View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator }from '@react-navigation/native-stack';
import TransactionDetails from './screens/basics/SavingsAccountDetailsScreen';
import StyledButton from './screens/components/StyledButton'

import {LoginScreen} from './screens/basics/LoginScreen/index'
import MainMenu from './screens/basics/MainMenuScreen';
import SavingsListScreen from './screens/basics/TransactionScreen/index';
import CreateNewSavingsScreen from './screens/basics/CreateNewSavingsScreen';
import { ConfirmCreateNewSavingsScreen } from './screens/basics/CreateNewSavingsScreen';
import ConfirmSettleScreen from './screens/basics/SettleSavingsScreen';
import HashInformationScreen from './screens/basics/HashInformationScreen';
import { AccountMenuScreen, EnterNewPasscodeScreen, UnlockPrivateKeyScreen, PrivateKeyScreen } from './screens/basics/AccountInformationScreen';
import { MoralisProvider } from 'react-moralis';
import { profile } from './logic/constant/env';

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
  //  ===========
  // return (
  //   <CreateNewSavingsScreen/>
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
        <Stack.Screen component={AccountMenuScreen}
                      name='My account'/>
        <Stack.Screen component={SavingsListScreen}
                      name='Savings list'/>
        <Stack.Screen component={TransactionDetails}
                      name='Savings account details'/>
        <Stack.Screen component={CreateNewSavingsScreen}
                      name='New savings account'/>
        <Stack.Screen component={ConfirmCreateNewSavingsScreen}
                      name='Confirm creation'/>
        <Stack.Screen component={ConfirmSettleScreen}
                      name='Confirm settle'/>
        <Stack.Screen component={HashInformationScreen}
                      name='Hash details'/>
        <Stack.Screen component={EnterNewPasscodeScreen}
                      name='Enter new passcode'/>
        <Stack.Screen component={UnlockPrivateKeyScreen}
                      name='Unlock private key'/>
        <Stack.Screen component={PrivateKeyScreen}
                      name='Private key'/>
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
