import { StatusBar } from 'expo-status-bar';
import {Text, View, Pressable} from 'react-native';

import styles from './styles.js'

const StyledButton = (props) => {
    const type = props.type;
    const btnText = props.title;
    const onPressFn = props.onPress;
    const bgColor = type === 'primary' ? '#0FA3B1' : '#EDDEA4';
    const fontColor = type === 'primary' ? '#FFFFFF' : '#000000';
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