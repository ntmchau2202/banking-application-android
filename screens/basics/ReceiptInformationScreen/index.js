import { View, Text, TouchableOpacity, Alert } from "react-native";
import { profile } from "../../../logic/constant/env";
import styles from "./styles"

const ReceiptInformationScreen = (navigation) => {
    let originalObject = navigation.route.params
    console.log("Received object:", originalObject)
    const receipt = originalObject.original
    const decodedReceipt = originalObject.decodedBody.message

    return (
        <View style={styles.tableContainer}>
            <TouchableOpacity style={styles.tableRow} onPress={() => Alert.alert(receipt.bank_signature)}>
                <Text style={styles.tableColumnTitleText}>
                    Bank signature
                </Text>
                <Text style={styles.tableColumnTitleText}>
                    {receipt.bank_signature}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tableRow}>
                <Text style={styles.tableColumnTitleText}>
                    Time created
                </Text>
                <Text style={styles.tableColumnTitleText}>
                    {receipt.time_created}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tableRow}>
                <Text style={styles.tableColumnTitleText}>
                    Type
                </Text>
                <Text style={styles.tableColumnTitleText}>
                    {receipt.type}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tableRow}>
                <Text style={styles.tableColumnTitleText}>
                    Receipt
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tableReceiptRow}>
                <Text style={styles.tableReceiptRow}>
                    {decodedReceipt}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default ReceiptInformationScreen