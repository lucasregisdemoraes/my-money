import storage from "./storage.js"

export default {
    formatValueToCurrency: value => value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),

    // =    ======= OU ========

    // formatValueToCurrency: value => {
    //     return value.toLocaleString('pt-br',
    //         {
    //             style: 'currency',
    //             currency: 'BRL'
    //         })
    //     },

    getMonthsFromTransactions: transactions => {
        let months = []
        transactions.forEach((transaction) => {
            if (!months.includes(transaction.date.substring(3))) {
                months.push(transaction.date.substring(3))
            }
        })

        return months
    },
    convertDateFormat: (date, separator, newSeparator) => {
        date = date.split(separator)
        date = date[2] + newSeparator + date[1] + newSeparator + date[0]
        return date
    },
    formatDateToMonthName: date => {
        let monthNumber = date.substring(0, 2)
        switch (monthNumber) {
            case "01":
                return "janeiro";
            case "02":
                return "Fevereiro";
            case "03":
                return "Março";
            case "04":
                return "Abril";
            case "05":
                return "Maio";
            case "06":
                return "Junho";
            case "07":
                return "Julho";
            case "08":
                return "Agosto";
            case "09":
                return "Setembro";
            case "10":
                return "Outubro";
            case "11":
                return "Novembro";
            case "12":
                return "Dezembro";
            default:
                break;
        }
    },
    // getInvestmentsValue: () => {
    //     let storageCopy = storage.get()

    //     let total = 0

    //     storageCopy.investments.forEach(investment => {
    //         const lastMonth = investment.months[investment.length - 1]
    //         const lastMonthTotal = lastMonth.value + lastMonth.invested
    //         total += lastMonthTotal
    //     })
    //     return total
    // },
    getTotalValue: () => {
        let storageCopy = storage.get()

        const investments = storageCopy.investments
        let investmentsTotal = 0
        let totalInvested = 0

        const transactions = storageCopy.transactions


        investments.forEach(investment => {
            const lastMonth = investment.months[investment.months.length - 1]
            const lastMonthTotal = lastMonth.value + lastMonth.invested
            investmentsTotal += lastMonthTotal
            totalInvested += investment.invested
        })

        function getTotalValueFromFilteredTransactions(filterKey) {
            return transactions.filter(transaction => {
                return transaction.paymentMethods[filterKey] !== 0
            }).reduce((accumulator, currentValue) => accumulator + currentValue.paymentMethods[filterKey], 0)
        }

        return {
            account: {
                name: "conta",
                value: getTotalValueFromFilteredTransactions("account") - totalInvested
            },
            cash: {
                name: "dinheiro",
                value: getTotalValueFromFilteredTransactions("cash")
            },
            coin: {
                name: "moeda",
                value: getTotalValueFromFilteredTransactions("coin")
            },
            investments: {
                name: "investimentos",
                value: investmentsTotal
            }
        }
    }
}