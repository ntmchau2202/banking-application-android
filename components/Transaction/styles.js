import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
    },
    
    txnContainer: {
        // flex: 1,
      backgroundColor: 'transparent',
      width: '100%',
      height: 0.1 * Dimensions.get('window').height,
    },

    text: {
      fontSize: 12,
      textTransform: 'uppercase',
      color: 'black'
    },

    line: {
      height: 0.5,
      width: "100%",
      backgroundColor:"rgba(255,255,255,0.5)"
    }

  });

export default styles;