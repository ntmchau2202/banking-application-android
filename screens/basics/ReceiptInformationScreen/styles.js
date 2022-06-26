import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
    },


    tableContainer: {
        padding: 10,
        flexDirection: 'column',
        alignContent: 'flex-start',
    },

    tableRow: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        height: 0.05* Dimensions.get('window').height,
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 5,
        borderBottomWidth: 1,
    },

    tableColumnTitle: {
        borderColor: 'black',
        borderWidth: 1,
        flex: 0.4,
        backgroundColor: 'transparent',
        width: 0.2 * Dimensions.get('window').width,
        height: 0.05 * Dimensions.get('window').height,
        flexDirection: 'row',
        margin: 5,
        flexWrap: 'wrap'
    },

    tableColumnContent: {
        flexDirection: 'row',
        flex: 1,
        width: 0.8 * Dimensions.get('window').width,
        height: 0.05 * Dimensions.get('window').height,
        alignContent: 'flex-end',
        margin: 5,
        paddingTop: 5,
    },

    tableColumnTitleText: {
        fontSize: 12,
        textTransform: 'uppercase',
        flex: 1,
        flexWrap: 'wrap',
    },

    tableColumnContentText: {
        fontSize: 12,
        textTransform: 'uppercase',
        padding: 5,
    },

    confirmationContainer: {
        flex: 1,
        width: '100%',
        height: 2 * Dimensions.get('screen').height,
        flexDirection: 'column',
        alignItems: 'stretch',
    },

    confirmationInfo: {
        flex: 5,
    },

    confirmationButton: {
        flex: 1,
        position: 'absolute',
        bottom: 20,
        width: Dimensions.get('window').width
    },

    tableReceiptRow: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        height: 0.5 * Dimensions.get('window').height,
        alignItems: 'center',
        margin: 5,
        flex: 1,
        flexWrap: 'wrap',
        backgroundColor: "#619cfa"
    },

  });

export default styles;