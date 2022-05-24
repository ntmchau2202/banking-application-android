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
}