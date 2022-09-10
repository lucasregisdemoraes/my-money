import Storage from "./storage.js";

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
    new: (event) => {
        event.preventDefault()
    
        let inputsValue = [...document.querySelectorAll("form input")].map(input => input.value)

        let transaction = {
            paymentMethods: {
                account: inputsValue[0],
                cash: inputsValue[1],
                coin: inputsValue[2]
            },
            value: Number(inputsValue[0]) + Number(inputsValue[1]) + Number(inputsValue[2]),
            date: inputsValue[3],
            description: inputsValue[4]
        }

        let storageCopy = Storage.get()
        storageCopy.transactions.push(transaction)
        Storage.set(storageCopy)
    },
    remove: () => { }
}