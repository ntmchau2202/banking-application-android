class BankAccount {
    constructor(bankAccountID, balance) {
        this.id = bankAccountID
        this.balance = balance 
        this.savingsAccounts = []
    }

    addSavingsAccount(savingsAccount) {
        for(let i = 0; i < this.savingsAccounts.length; i++) {
            if(this.savingsAccounts[i].id === savingsAccount.id) {
                return
            }
        }
        this.savingsAccounts.push(savingsAccount)
    }

    removeSavingsAccount(savingsAccount) {
        for(let i = 0; i < this.savingsAccounts.length; i++) {
            if(this.savingsAccounts[i].id === savingsAccount.id) {
                this.savingsAccounts.splice(i)
                return
            }
        }
        return
    }
}

class SavingsAccount {
    // constructor(savingsAccountID, productType, savingsPeriod, savingsAmount, interestRate, savingsAmount, 
    //             estimatedInterestAmount, actualInterestAmount, settleInstruction, openTime, settleTime, 
    //             creationConfirmed, settleConfirmed, currency) {
    //     this.id = savingsAccountID
    //     this.type = productType
    //     this.period = savingsPeriod
    //     this.amount = savingsAmount
    //     this.estimateInterest = estimatedInterestAmount
    //     this.actualInterest = actualInterestAmount
    //     this.rate = interestRate
    //     this.instruction = settleInstruction
    //     this.openTime = openTime
    //     this.settleTime = settleTime
    //     this.creationConfirmed = creationConfirmed
    //     this.settleConfirmed = settleConfirmed
    //     this.currency = currency 
    // }

    constructor(obj) {
        console.log("obj received:", obj)
        this.id = obj.savingsaccount_id
        this.type = obj.product_type
        this.period = obj.savings_period
        this.amount = obj.savings_amount
        this.estimateInterest = obj.estimated_interest_amount
        this.bankAccountID = obj.bankaccount_id
        this.actualInterest = obj.actual_interest_amount
        this.rate = obj.interest_rate
        this.instruction = obj.settle_instruction
        this.openTime = obj.open_time
        this.settleTime = obj.settle_time
        this.creationConfirmed = obj.creation_confirmed
        this.settleConfirmed = obj.settle_confirmed
        this.currency = obj.currency
        this.status = obj.confirm_status
        this.openReceipt = obj.open_ipfs_receipt_hash
        this.settleReceipt = obj.settle_ipfs_receipt_hash
    }
}

module.exports.BankAccount = BankAccount
module.exports.SavingsAccount = SavingsAccount