import { TouchableOpacity, View, Text, Image} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import styles from './styles'

class SavingsAccount {
    constructor(props) {
        this.state = {
            creationConfirmed: props.txn.creationConfirmed,
            settleConfirmed: props.txn.settleConfirmed,
            bankAccountID: props.txn.bankAccountID,
            savingsAccountID: props.txn.id,
            savingsPeriod: props.txn.period,
            interestRate: props.txn.rate,
            savingsAmount: props.txn.amount,
            estimatedInterestAmount: props.txn.estimateInterest,
            actualInterestAmount: props.txn.actualInterest,
            settleInstruction: props.txn.instruction,
            currency: props.txn.currency,
            openTime: props.txn.openTime,
            settleTime: props.txn.settleTime,
            savingsType: props.txn.type,
            status: props.txn.status
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
                        Type: {this.state.savingsType}
                    </Text>
                    <Text style={styles.text}>
                        Balance: {this.state.savingsAmount} {this.state.currency}
                    </Text>
                    <Text style={styles.text}>
                        Open time: {this.state.openTime}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default SavingsAccount