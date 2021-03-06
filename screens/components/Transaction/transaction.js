import { TouchableOpacity, Image, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import styles from './styles'

export class OpenTransaction {
    constructor(props) {
        this.state = {
            name: props.txn.name,
            txnHash: props.txn.txnHash,
            blockHash: props.txn.blockHash,
            blockNumber: props.txn.blockNumber,
            customerID: props.txn.customerID,
            savingsAccountID: props.txn.savingsAccountID,
            savingsType: props.txn.savingsType,
            savingsPeriod: props.txn.savingsPeriod,
            interestRate: props.txn.interestRate,
            savingsAmount: props.txn.savingsAmount,
            estimatedInterestAmount: props.txn.estimatedInterestAmount,
            settleInstruction: props.txn.settleInstruction,
            currency: props.txn.currency,
            openTime: props.txn.openTime,
            bankID: props.txn.bankID,
        }
    }

    render(navName) {
        const navigation = useNavigation()
        const data = this.state
        return (
            <TouchableOpacity style={styles.txnContainer}
                                onPress={() => {
                                    navigation.navigate(navName, data)
                                }}>
                <View style={styles.imageContainer}>    

                {/* <View> */}
                    <Image style={styles.image}
                        source={require('./open.jpg')}></Image>
                </View>
                {/* <View> */}
                <View style={styles.informationContainer}>
                    <Text style={styles.text}>
                        Type: {this.state.name}
                    </Text>
                    <Text style={styles.text}>    
                        Transaction Hash: {this.state.txnHash} 
                    </Text>
                    <Text style={styles.text}>
                        Block Hash: {this.state.blockHash}
                    </Text>
                    <Text style={styles.text}>
                        Block Number: {this.state.blockNumber}
                    </Text>
                    <Text style={styles.text}>
                        Time: {this.state.openTime}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export class SettleTransaction {
    constructor(props) {
        this.state = {
            name: props.txn.name,
            txnHash: props.txn.txnHash,
            blockHash: props.txn.blockHash,
            blockNumber: props.txn.blockNumber,
            customerID: props.txn.customerID,
            savingsAccountID: props.txn.savingsAccountID,
            actualInterestAmount: props.txn.actualInterestAmount,
            settleTime: props.txn.settleTime,
            bankID: props.txn.bankID,
        }
    }

    render(navName) {
        const navigation = useNavigation()
        const data = this.state
        return (
            <TouchableOpacity style={styles.txnContainer}
                                onPress={() => {
                                    navigation.navigate(navName, data)
                                }}>
                <View style={styles.imageContainer}>
                {/* <View> */}
                    <Image style={styles.image}
                        source={require('./settle.jpg')}/>
                </View>
                {/* <View> */}
                <View style={styles.informationContainer}>
                    <Text style={styles.text}>
                        Type: {this.state.name}
                    </Text>
                    <Text style={styles.text}>    
                        Transaction Hash: {this.state.txnHash} 
                    </Text>
                    <Text style={styles.text}>
                        Block Hash: {this.state.blockHash}
                    </Text>
                    <Text style={styles.text}>
                        Block Number: {this.state.blockNumber}
                    </Text>
                    <Text style={styles.text}>
                        Time: {this.state.settleTime}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}