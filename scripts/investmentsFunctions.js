import Storage from "./storage.js";

export default {
    new: newInvestment => {
        let storageCopy = Storage.get()

        storageCopy.investments.push({
            name: newInvestment.name,
            start: newInvestment.date,
            invested: Number(newInvestment.value),
            months: [
                {
                    month: newInvestment.date.substring(3),
                    value: newInvestment.value
                }
            ],
            status: "ativo"
        })

        storageCopy.whereIsTheMoney.account.value -= Number(newInvestment.value)
        storageCopy.whereIsTheMoney.investments.value += Number(newInvestment.value)

        Storage.set(storageCopy)
    },
    getLastMonthIncome: (investment, type) => {
        let lastMonthIncome = 0
        let lastMonthIncomePercentage = 0

        // if investment months length is greater than 1 that means it is possible 
        // to know the last month income, so return the income, otherwise return 0
        if (investment.months.length > 1) {
            // get last month
            const lastMonth = investment.months[investment.months.length - 1]
            // get penult month
            const penultMonth = investment.months[investment.months.length - 2]

            lastMonthIncome = lastMonth.value - penultMonth.value
            lastMonthIncomePercentage = lastMonthIncome / penultMonth.value
        }

        return type === "value" ? lastMonthIncome : lastMonthIncomePercentage
    },
    getTotalIncome: (investment, type) => {
        let totalIncome = 0
        let totalIncomePercentage = 0

        if (investment.months.length > 1) {
            const firstMonth = investment.months[0]
            const lastMonth = investment.months[investment.months.length - 1]

            totalIncome = lastMonth.value - firstMonth.value
            totalIncomePercentage = totalIncome / firstMonth.value
        }

        return type === "value" ? totalIncome : totalIncomePercentage

    },
}