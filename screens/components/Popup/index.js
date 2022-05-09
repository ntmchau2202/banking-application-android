import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Dialog from 'react-native-dialog'

import styles from './styles'

const Popup = (props) => {
    const visible = props.value
    const content = props.content
    const handler = props.onPress
    return (
        <View style={styles.containter}>
            <Dialog.Container visible={visible}> 
                <Dialog.Title>Login information</Dialog.Title>
                <Dialog.Description>{content}</Dialog.Description>
                <Dialog.Button label='OK' onPress={() => {
                    handler(false)
                }}></Dialog.Button>
            </Dialog.Container>
        </View>
    )
}

export default Popup