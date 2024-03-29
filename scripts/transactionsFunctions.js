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

        Storage.set(storageCopy)
    },
    transfer: ({ value, date, from, to}) => {
        let storageCopy = Storage.get()

        const firstTransaction = {
            paymentMethods: {
                account: 0,
                cash: 0,
                coin: 0
            },
            value: Number(value),
            date: Utils.convertDateFormat(date, "-", "/"),
            description: `Transferência: de ${from} para ${to}`
        }

        firstTransaction.paymentMethods[from] -= value

        let secondTransaction = {
            paymentMethods: {
                account: 0,
                cash: 0,
                coin: 0
            },
            value: Number(value),
            date: Utils.convertDateFormat(date, "-", "/"),
            description: `Transferência: de ${from} para ${to}`
        }

        secondTransaction.paymentMethods[to] += value

        storageCopy.transactions.push(firstTransaction)
        storageCopy.transactions.push(secondTransaction)

        Storage.set(storageCopy)
    },
    remove: index => {
        let storageCopy = Storage.get()

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

        storageCopy.transactions[parameters.index] = parameters.newTransaction

        Storage.set(storageCopy)
    }
}