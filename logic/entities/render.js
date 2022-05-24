// import { Customer } from "./customer"
const Customer = require("./customer").Customer
// import { BankAccount, SavingsAccount } from "./bankaccount"
const BankAccount = require("./bankaccount").BankAccount
const SavingsAccount = require("./bankaccount").SavingsAccount

class Render {
    static renderLoginInfo(resp) {
        let respObj = resp.details.customer_details
        let customer = new Customer(
            respObj.customer_name,
            respObj.customer_id,
            respObj.customer_type,
            respObj.customer_phone
        )
        let bankAccounts = respObj.bank_accounts
        for (let i = 0; i < bankAccounts.length; i++) {
            let bankAccount = new BankAccount(bankAccounts[i].bankaccount_id, bankAccounts[i].balance)
            let savingsAccounts = bankAccounts[i].savings_accounts
            for (let j = 0; j < savingsAccounts.length; j++) {
                let savingsAccount = new SavingsAccount(savingsAccounts[j])
                bankAccount.addSavingsAccount(savingsAccount)
            }
            customer.addBankAccount(bankAccount)
        }

        return customer
    }
}

module.exports.Render = Render