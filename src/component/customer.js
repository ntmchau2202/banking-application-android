class Customer {
    constructor(name, customerID, customerType, phone) {
        this.name = name
        this.phone = phone
        this.id = customerID
        this.type = customerType
        this.bankAccounts = []
    }

    addBankAccount(bankAccount) {
        for (let i = 0; i < bankAccount.length; i++) {
            if (this.bankAccounts[i].id === bankAccount.id) {
                return
            }
        }
        this.bankAccounts.push(bankAccount)
    }

    removeBankAccount(bankAccount) {
        for (let i = 0; i < bankAccount.length; i++) {
            if (this.bankAccounts[i].id === bankAccount.id) {
                this.bankAccounts.splice(i)
                return
            }
        }
        return
    }
}

module.exports.Customer = Customer