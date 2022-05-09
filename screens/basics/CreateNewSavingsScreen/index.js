import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import StyledInput from "../../components/StyledInput";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import styles from './styles'
import {period, currency, settleStrategy} from './periods'
import { useState } from "react";
import StyledButton from "../../components/StyledButton";
import { useNavigation } from "@react-navigation/native";

const CreateNewSavingsScreen = () => {
    const navigation = useNavigation()

    const [visibleSource, setVisibleState] = useState(false)
    let toggleSource = () => setVisibleState(!visibleSource)
    const [displaySource, changeSourceText] = useState('Select source')
    const [selectedSource, setSource] = useState('')

    const [visibleCurrency, setVisibleCurrency] = useState(false)
    let toggleCurrency = () => setVisibleCurrency(!visibleCurrency)
    const [displayCurrency, changeCurrencyText] = useState('Select currency')
    const [selectedCurrency, setCurrency] = useState('')

    const [visibleSettle, setVisibleSettle] = useState(false)
    let toggleSettle = () => setVisibleSettle(!visibleSettle)
    const [displaySettle, changeSettleText] = useState('Select settle strategy')
    const [selectedSettleStrategy, setStrategy] = useState('')

    const [visiblePeriod, setVisiblePeriod] = useState(false)
    let togglePeriod = () => setVisiblePeriod(!visiblePeriod)
    const [displayPeriod, changePeriodText] = useState('Select savings period')
    const [selectedInterest, setInterest] = useState(0)
    const [selectedPeriod, setPeriod] = useState(0)

    const [inputSavingsAmount, setSavingsAmount] = useState(0)
    const [estimatedInterest, setEstimatedInterest] = useState(0)
    let calculateInterest = (amt) => {
        console.log("input amt:", amt)
        console.log('selected period:', selectedInterest)
        if (amt.length === 0) {
            amt = 0
        }
        let result = 0
        setSavingsAmount(amt)
        if (amt !=0 && selectedInterest != 0) {
            result = amt / 100 * (selectedInterest / 365 * 30 * selectedPeriod)
        }
        setEstimatedInterest(result)
        console.log("estimatedInterest:", estimatedInterest)
    }

    let renewInterest = (amt, interest, period) => {
        console.log("in renewInterest")
        console.log("input amt:", amt)
        console.log('selected period:', interest)
        if (amt.length === 0) {
            amt = 0
        }
        let result = 0
        setSavingsAmount(amt)
        if (amt !=0 && interest != 0) {
            result = amt / 100 * (interest / 365 * 30 * period)
        }
        setEstimatedInterest(result)
        console.log("estimatedInterest:", estimatedInterest)
    }
    return (
        <View style={styles.container}>
            <View style={styles.option}>
                <Text style={styles.optionLabel}>
                    Source:
                </Text>
                <Menu style={styles.optionDropdown}
                    visible={visibleSource}
                    anchor={<Text style={styles.optionDropdown} onPress={toggleSource}>{displaySource}</Text>}
                    onRequestClose={toggleSource}>
                    <MenuItem onPress={() => {
                        changeSourceText('Hiiiiii')
                        setSource('Hiiiiii')
                        toggleSource()
                    }}>Hiiiiii</MenuItem>
                </Menu>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionLabel}>
                    Current balance: 
                </Text>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionLabel}>Savings amount:</Text>
            </View>
            <StyledInput placeholder={'Enter your desired savings amount here'}
                            type='number'
                            value={inputSavingsAmount}
                            setValue={calculateInterest}/>
            <View style={styles.option}>
            <Text style={styles.optionLabel}>
                    Currency:
                </Text>
                <Menu style={styles.optionDropdown}
                    visible={visibleCurrency}
                    anchor={<Text style={styles.optionDropdown} onPress={toggleCurrency}>{displayCurrency}</Text>}
                    onRequestClose={toggleCurrency}>
                    {Object.entries(currency).map(([k, v]) => {
                        return (
                            <MenuItem onPress={() => {
                                changeCurrencyText(k)
                                setCurrency(k)
                                toggleCurrency()
                            }}>{v}</MenuItem>
                        )
                    })}
                </Menu>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionLabel}>Savings period (months):</Text>
                <Menu style={styles.optionDropdown}
                    visible={visiblePeriod}
                    anchor={<Text style={styles.optionDropdown} onPress={togglePeriod}>{displayPeriod}</Text>}
                    onRequestClose={togglePeriod}>
                    {Object.entries(period).map(([k, v]) => {
                        return (
                            <MenuItem onPress={()=>{
                                setInterest(v)
                                setPeriod(k)
                                changePeriodText(k)
                                renewInterest(inputSavingsAmount, v, k)
                                togglePeriod()
                            }}>{k}</MenuItem>
                        )
                    })}
                </Menu>

            </View>
            <View style={styles.option}>
                <Text style={styles.optionLabel}>
                    Interest rate (%):
                </Text>
                <Text>
                    {selectedInterest}
                </Text>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionLabel}>
                    Estimated interest: 
                </Text>
                <Text>
                    {estimatedInterest}
                </Text>
            </View>
            <View style={styles.option}>
                <Text style={styles.optionLabel}>
                    Settle instruction:
                </Text>
                <Menu style={styles.optionDropdown}
                    visible={visibleSettle}
                    anchor={<Text style={styles.optionDropdown} onPress={toggleSettle}>{displaySettle}</Text>}
                    onRequestClose={toggleSettle}>
                    {Object.entries(settleStrategy).map(([k, v]) => {
                        return (
                            <MenuItem onPress={() => {
                                changeSettleText(v)
                                setStrategy(k)
                                toggleSettle()
                            }}>{v}</MenuItem>
                        )
                    })}
                </Menu>
            </View>
            <StyledButton type='primary'
                            title='Create new account'
                            onPress={()=>{
                                navigation.navigate('Confirm creation', {
                                    source: selectedSource,
                                    savingsAmount: inputSavingsAmount,
                                    currency: selectedCurrency,
                                    savingsPeriod: selectedPeriod,
                                    interestRate: selectedInterest,
                                    estimatedInterestAmount: estimatedInterest,
                                    settleInstruction: selectedSettleStrategy,
                                })
                            }} />
        </View>
    )
}

export const ConfirmCreateNewSavingsScreen = (navigation) => {
    return(
        <View style={styles.container}>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Source</Text>
                <Text style={styles.orderDetails}>{navigation.route.params.source}</Text>
            </View>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Savings amount</Text>
                <Text style={styles.orderDetails}>{navigation.route.params.savingsAmount}</Text>
            </View>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Savings period (months)</Text>
                <Text style={styles.orderDetails}>{navigation.route.params.savingsPeriod}</Text>
            </View>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Interest rate (%)</Text>
                <Text style={styles.orderDetails}>{navigation.route.params.interestRate}</Text>
            </View>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Interest amount</Text>
                <Text style={styles.orderDetails}>{navigation.route.params.estimatedInterestAmount}</Text>
            </View>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Currency</Text>
                <Text style={styles.orderDetails}>{navigation.route.params.currency}</Text>
            </View>
            <View style={styles.orderItem}>
                <Text style={styles.orderLabel}>Settle instruction</Text>
                <Text style={styles.orderDetails}>{navigation.route.params.settleInstruction}</Text>
            </View>
            <StyledButton type='primary'
                            title='Confirm'
                            onPress=''/>
            <StyledButton type='secondary'
                            title='Go back'
                            onPress=''/>
        </View>
    )
}
export default CreateNewSavingsScreen