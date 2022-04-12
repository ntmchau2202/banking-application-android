import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
    },
    
    txnContainer: {
      flexDirection: 'row',
      backgroundColor: 'transparent',
      width: '100%',
      height: 0.1 * Dimensions.get('window').height,
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 5,
    },

    text: {
      fontSize: 12,
      textTransform: 'uppercase',
      color: 'black'
    },

    image: {
      flex: 1,
      width: '30%',
      height: '100%',
    },

    imageContainer: {
      borderColor: 'black',
      borderWidth: 1,
      flex: 0.3,
      backgroundColor: 'transparent',
      width: 0.1 * Dimensions.get('window').height,
      height: 0.1 * Dimensions.get('window').height,
      flexDirection: 'row',
      margin: 5,
    },

    informationContainer: {
      flex: 1,
      width: 0.9 * Dimensions.get('window').height,
      height: 0.1 * Dimensions.get('window').height,
      alignContent: 'flex-start',
      margin: 5,
      paddingTop: 5,
    }

  });

export default styles;