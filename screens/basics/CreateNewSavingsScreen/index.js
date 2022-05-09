import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import StyledInput from "../../components/StyledInput";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import styles from './styles'
import {period, currency, settleStrategy} from './periods'
import { useState } from "react";

const CreateNewSavingsScreen = () => {
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
    const [selectedPeriod, setPeriod] = useState(0)

    const [inputSavingsAmount, setSavingsAmount] = useState(0)
    const [estimatedInterest, setEstimatedInterest] = useState(0)
    let calculateInterest = (amt) => {
        console.log("input amt:", amt)
        console.log('selected period:', selectedPeriod)
        if (amt.length === 0) {
            amt = 0
        }
        let result = 0
        setSavingsAmount(amt)
        if (amt !=0 && selectedPeriod != 0) {
            result = amt / 100 * selectedPeriod
        }
        setEstimatedInterest(result)
        console.log("estimatedInterest:", estimatedInterest)
    }

    let renewInterest = (amt, interest) => {
        console.log("in renewInterest")
        console.log("input amt:", amt)
        console.log('selected period:', interest)
        if (amt.length === 0) {
            amt = 0
        }
        let result = 0
        setSavingsAmount(amt)
        if (amt !=0 && interest != 0) {
            result = amt / 100 * interest
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
                    }}></MenuItem>
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
                <Text style={styles.optionLabel}>Savings period:</Text>
                <Menu style={styles.optionDropdown}
                    visible={visiblePeriod}
                    anchor={<Text style={styles.optionDropdown} onPress={togglePeriod}>{displayPeriod}</Text>}
                    onRequestClose={togglePeriod}>
                    {Object.entries(period).map(([k, v]) => {
                        return (
                            <MenuItem onPress={()=>{
                                setPeriod(v)
                                changePeriodText(k)
                                renewInterest(inputSavingsAmount, v)
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
                    {selectedPeriod}
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
                {/* TODO: CALCULATE ESTIMATED INTEREST AMOUNT HERE */}
            </View>
                
        </View>
    )
}

function renderPeriods(valueHolder, setter) {
    return(
    <FlatList 
             data={props.content}
             renderItem={({item}) => <MenuItem onPress={setter}>Here is an item</MenuItem>}
             keyExtractor={item => item.txnHash}/>
    )
}
export default CreateNewSavingsScreen