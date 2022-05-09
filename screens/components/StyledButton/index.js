import { StatusBar } from 'expo-status-bar';
import {Text, View, Pressable} from 'react-native';

import styles from './styles.js'

const StyledButton = (props) => {
    const type = props.type;
    const btnText = props.title;
    const onPressFn = props.onPress;
    const bgColor = type === 'primary' ? 'black' : 'grey';
    const fontColor = 'white'
    return (
        <View style={styles.containter}>
            <Pressable 
                style={[styles.button, {backgroundColor: bgColor}]}
                onPress={(text)=>{
                    onPressFn(text)
                }}>
                <Text style={[styles.text, { color: fontColor} ]}>{btnText}</Text>
            </Pressable>

        </View>
    );
};

export default StyledButton;