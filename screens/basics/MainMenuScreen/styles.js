import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
    containner: {
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },

    text: {
        fontSize: 12,
        textTransform: 'uppercase',
    },

    menuText: {
        paddingTop: 5,
        paddingLeft: 5,
        width: '70%',
        flex: 1,
        borderWidth: 1,
        alignContent: 'flex-start',
        fontSize: 20,

    },

    menuContainer: {
        width: '100%',
    },

    menuIcon: {
        width: '30%',
        height: 0.05 * Dimensions.get('window').height,
        borderWidth: 1,
        alignContent: 'flex-start',
    },

    menuOption: {
        width: '100%',
        height: 0.05 * Dimensions.get('window').height,
        borderWidth: 1,
        margin: 5,
        flexDirection: 'row',
    },

    userContainer: {
        width: '100%',
        height: 0.3 * Dimensions.get('window').height,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    userText: {
        fontSize: 12,
        textTransform: 'uppercase',
    },

    userAvatar: {
        flex: 0.5,
        width: 0.3 * Dimensions.get('window').width,
        padding: 10,
    }

  });

export default styles;