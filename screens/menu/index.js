import React from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

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
                        content=''/>
            <MenuOption title='Your transactions'
                        content='Transaction list'/>
            <MenuOption title='Pending transactions'
                        content=''/>
        </View>
    )
}

const MenuOption = (props) => {
    const navigation = useNavigation();
    console.log(props.content)
    return (
        <TouchableOpacity style={styles.menuOption}
                          onPress={() => {
                              navigation.navigate(props.content)
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