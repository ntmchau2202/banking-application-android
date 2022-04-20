import React from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

const AccountMenuScreen = () =>  {
    return (
        <View style={styles.containner}>
            <AccountOption name='Export private key'
                            content=''/>
            <AccountOption name='Export passphrase'
                            content=''/>
            <AccountOption name='Change password'
                            content=''/>
            <AccountOption name='Change basic information'
                            content=''/>
            <AccountOption name='Logout'
                            content=''/>
            <AccountOption name='Deactive account'
                            content=''/>
        </View>
    )
}

const AccountOption = (props) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity style={styles.containner}
                            onTouch={() => {
                                navigation.navigate(props.content)
                            }}>
            <Text style={styles.text}>
                {props.name}
            </Text>
        </TouchableOpacity>
    )
}

const AccountDetails = (props) => {
    return (
        <View style={styles.accountDetailContainer}>
            <Image style={styles.accountAvatar}/>
            <AccountDetailSection name='Name'
                                content='Chou chou'/>
            <AccountDetailSection name='Phone'
                                content='0123456789'/>
            <AccountDetailSection name='Join date'
                                content='12/03/2022'/>
            <AccountDetailSection name='Number of transactions'
                                content='14'/>
        </View>
    )
}

const AccountDetailSection = (props) => {
    return (
        <View>
            <Text style={styles.accountDetailsText}>
                {props.name}
            </Text>
            <Text style={styles.accountDetailsText}>
                {props.details}
            </Text>
        </View>
    )
}