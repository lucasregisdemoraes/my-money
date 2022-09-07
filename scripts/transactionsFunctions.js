export default {
    incomesSumByMonth: (transactions, month) => {
        let total = 0

        transactions.forEach(transaction => {
            if(transaction.date.substring(3) === month && transaction.value > 0) {
                total += transaction.value
            }
        });
        return total
    },
    expensesSumByMonth: (transactions, month) => {
        let total = 0

        transactions.forEach(transaction => {
            if(transaction.date.substring(3) === month && transaction.value < 0) {
                total += transaction.value
            }
        });
        return total
    },
    totalByMonth: (transactions, month) => {
        let total = 0

        transactions.forEach(transaction => {
            if(transaction.date.substring(3) === month) {
                total += transaction.value
            }
        });
        return total
    },
    add: () => {},
    remove: () => {}
}