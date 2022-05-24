import React, { useState } from 'react';
import { Text, View, TouchableOpacity, FlatList} from 'react-native';
// import StyledButton from '../../components/components/StyledButton';
// import StyledInput from '../../components/components/StyledInput';
import StyledButton from '../../components/StyledButton/index.js';
import StyledInput from '../../components/StyledInput/index.js';
import styles from './styles.js'
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import { Link } from 'native-base';
import { profile } from '../../../logic/constant/env.js';

const HashInformationScreen = (navigation) => {
    let originalObject = navigation.route.params
    // fetch customer & bank signature here
    return(
        <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
                <Text style={styles.tableColumnTitleText}>{originalObject.name}</Text>
                <Text style={styles.tableColumnContentText}> {originalObject.content} </Text>
            </View>
            <View style={styles.tableRow}>
                <Text style={styles.tableColumnTitleText}>Customer signature</Text>
                <Text style={styles.tableColumnContentText}> {originalObject.sig1} </Text>
            </View>
            <View style={styles.tableRow}>
                <Text style={styles.tableColumnTitleText}>Bank signature</Text>
                <Text style={styles.tableColumnContentText}> {originalObject.sig2} </Text>
            </View>
            <StyledButton type='primary'
                            title='View on Polygon scan'
                            onPress={()=>{
                                let url = 'https://mumbai.polygonscan.com/tx/' + originalObject.content
                                Linking.canOpenURL(url).then(supported => {
                                    if (supported) {
                                        Linking.openURL(url)
                                    } else {
                                        console.warn('Unable to open link to blockchain network')
                                    }
                                })
                            }}/>
            <StyledButton type='secondary'
                            title='Verify information'
                            onPress={() => {
                                let isSettle = true
                                if (originalObject.name === "Creation hash") {
                                    isSettle = false
                                }
                                if (isSettle) {
                                    profile.connector.verifySettlement(profile.currentWorkingSavingsAccount)
                                } else {
                                    profile.connector.verifyCreation(profile.currentWorkingSavingsAccount)
                                }
                            }}/>
        </View>
    )
                   
    // data.wait()
    // console.log('data is:', data)

    // return (
    //     <View style={styles.tableContainer}>
    //         <View style={styles.tableRow}>
    //             <Text style={styles.tableColumnTitleText}>{originalObject.name}</Text>
    //             <Text style={styles.tableColumnContentText}> {originalObject.content} </Text>
    //         </View>
    //         <View style={styles.tableRow}>
    //             <Text style={styles.tableColumnTitleText}>Customer signature</Text>
    //             <Text style={styles.tableColumnContentText}> {data[2][0]} </Text>
    //         </View>
    //         <View style={styles.tableRow}>
    //             <Text style={styles.tableColumnTitleText}>Bank signature</Text>
    //             <Text style={styles.tableColumnContentText}> {data[2][1]} </Text>
    //         </View>
    //         <StyledButton type='primary'
    //                       title='View on Polygon scan'
    //                       onPress={()=>{
    //                           let url = 'https://mumbai.polygonscan.com/tx/' + originalObject.content
    //                           Linking.canOpenURL(url).then(supported => {
    //                               if (supported) {
    //                                 Linking.openURL(url)
    //                               } else {
    //                                 console.warn('Unable to open link to blockchain network')
    //                               }
    //                           })
    //                       }}/>
    //         <StyledButton type='secondary'
    //                       title='Verify signatures'
    //                       onPress={() => {
    //                         // step 1: create your signature here
    //                         // step 2: ask for bank's signature
    //                         // step 3: call contract to verify
    //                         // if everything's ok, popup ok
    //                         // else, notify something went wrong

    //                       }}/>
    //     </View>
    // )  

}

export default HashInformationScreen