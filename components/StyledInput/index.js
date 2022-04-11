import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';

import styles from './styles.js'

const StyledInput = (props) => {
    const pch = props.placeholder
    const val = props.value
    const onChangeTextFn = props.setValue
    const keyboardType = props.type === 'number' ? 'numeric' : 'text';
    const pwdProp = props.type === 'password' ? true : false
    return (
        <View style={styles.containter}>
            <TextInput style={styles.textInput}
                        placeholder={pch}
                        keyboardType={keyboardType}
                        value={val}
                        onChangeText = {(text) => {
                            onChangeTextFn(text)
                        }}
                        secureTextEntry= {pwdProp}
                        >
            </TextInput>
        </View>

    )
}

export default StyledInput;