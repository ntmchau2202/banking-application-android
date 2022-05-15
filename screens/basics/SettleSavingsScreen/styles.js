import { Row } from "native-base";
import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      // alignItems: 'center',
      justifyContent: 'center',
    },
  
    buttonContainer: {
     position: 'absolute',
     bottom: 80,
     width: '100%',
    },

    option: {
      // margin: 5,
      flexDirection: 'row',
      // height: 0.04 * Dimensions.get('window').height,
      borderWidth: 1,
      padding: 5,
      margin: 5,
      fontSize: 14,
    },

    optionLabel: {
      width: 0.4 * Dimensions.get('window').width,
    },
    
    optionDropdown: {
      width: 0.6 * Dimensions.get('window').width,
    },

    orderItem: {
      flexDirection: 'row',
      padding: 5,
      margin: 5,
      fontSize: 18,
      borderWidth: 1,
    },

    orderLabel: {
      width: 0.4 * Dimensions.get('window').width,
    },

    orderDetails: {
      width: 0.6 * Dimensions.get('window').width,
    }

  });

export default styles;