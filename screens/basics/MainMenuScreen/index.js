import React from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './styles';
import txns from './txn'
import { useNavigation } from '@react-navigation/native';
import { profile } from '../../../logic/constant/env';

const UserBar = (props) => {
    return (
        <View style={styles.userContainer}>
            <Image style={styles.userAvatar}
                    source={require("./userIcon.png")}></Image>
            <Text style={styles.userText}>
                Hello, {props.content}
            </Text>
            <Text styles={styles.userText}>
                ID: {props.name}
            </Text>
        </View>
    )
}

const Menu = () => {
    return( 
        <View style={styles.menuContainer}>
            <MenuOption title='Your account'
                        name='My account'
                        content={profile.currentCustomer}/>
            <MenuOption title='Your savings account'
                        name='Savings list'
                        content={profile.currentCustomer.bankAccounts}/>
            <MenuOption title='New savings account'
                        name='New savings account'
                        content=''/>
        </View>
    )
}

const MenuOption = (props) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.menuOption}
                          onPress={() => {
                              navigation.navigate(props.name, props.content)
                          }}>
            <Text style={styles.menuText}>
                {props.title}
            </Text>
        </TouchableOpacity>
    )
}

const MainMenu = (navigation) => {
    return (
        <View style={styles.containner}>
            <UserBar content={navigation.route.params.content} /* name */
                    name={navigation.route.params.name} />    
            <Menu/>
        </View>
    )
}

export default MainMenu