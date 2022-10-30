import Storage from "./storage.js";
import Utils from "./utils.js";

export default {
    incomesSumByMonth: (transactions, month) => {
        let total = 0

        transactions.forEach(transaction => {
            if (transaction.date.substring(3) === month && transaction.value > 0) {
                total += transaction.value
            }
        });
        return total
    },
    expensesSumByMonth: (transactions, month) => {
        let total = 0

        transactions.forEach(transaction => {
            if (transaction.date.substring(3) === month && transaction.value < 0) {
                total += transaction.value
            }
        });
        return total
    },
    totalByMonth: (transactions, month) => {
        let total = 0

        transactions.forEach(transaction => {
            if (transaction.date.substring(3) === month) {
                total += transaction.value
            }
        });
        return total
    },
    new: (parameters) => {
        // function parameter
        /* {
            newTransaction: .......
        } */

        let storageCopy = Storage.get()

        storageCopy.transactions.push(parameters.newTransaction)

        storageCopy.whereIsTheMoney.account.value =
            storageCopy.whereIsTheMoney.account.value + parameters.newTransaction.paymentMethods.account

        storageCopy.whereIsTheMoney.cash.value =
            storageCopy.whereIsTheMoney.cash.value + parameters.newTransaction.paymentMethods.cash

        storageCopy.whereIsTheMoney.coin.value =
            storageCopy.whereIsTheMoney.coin.value + parameters.newTransaction.paymentMethods.coin

        Storage.set(storageCopy)
    },
    remove: index => {
        let storageCopy = Storage.get()

        storageCopy.whereIsTheMoney.account.value -=
            storageCopy.transactions[index].paymentMethods.account
        storageCopy.whereIsTheMoney.cash.value -=
            storageCopy.transactions[index].paymentMethods.cash
        storageCopy.whereIsTheMoney.coin.value -=
            storageCopy.transactions[index].paymentMethods.coin

        storageCopy.transactions.splice(index, 1)

        Storage.set(storageCopy)
    },
    edit: parameters => {
        // function parameters
        /* {
            index: .....,
            newTransaction: .....
        } */
        let storageCopy = Storage.get()

        // remove the previous transaction values from whereIsTheMoney
        storageCopy.whereIsTheMoney.account.value -=
            storageCopy.transactions[parameters.index].paymentMethods.account
        storageCopy.whereIsTheMoney.cash.value -=
            storageCopy.transactions[parameters.index].paymentMethods.cash
        storageCopy.whereIsTheMoney.coin.value -=
            storageCopy.transactions[parameters.index].paymentMethods.coin

        // add the new transaction values to whereIsTheMoney
        storageCopy.whereIsTheMoney.account.value +=
            parameters.newTransaction.paymentMethods.account
        storageCopy.whereIsTheMoney.cash.value +=
            parameters.newTransaction.paymentMethods.cash
        storageCopy.whereIsTheMoney.coin.value +=
            parameters.newTransaction.paymentMethods.coin

        storageCopy.transactions[parameters.index] = parameters.newTransaction

        Storage.set(storageCopy)
    }
}