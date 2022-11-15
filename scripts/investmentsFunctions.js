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
                    month: newInvestment.date,
                    value: Number(newInvestment.value)
                }
            ],
            status: "ativo"
        })

        storageCopy.whereIsTheMoney.account.value -= Number(newInvestment.value)
        storageCopy.whereIsTheMoney.investments.value += Number(newInvestment.value)

        Storage.set(storageCopy)
    },
    remove: index => {
        let storageCopy = Storage.get()
        const value = Storage.get().investments[index].invested

        storageCopy.whereIsTheMoney.account.value += value
        storageCopy.whereIsTheMoney.investments.value -= value
        storageCopy.investments.splice(index, 1)

        Storage.set(storageCopy)
    },
    edit: parameters => {
        // {
        //     index: ....,
        //     newInvestment: ......
        // }

        let storageCopy = Storage.get()
        const previousValue = Storage.get().investments[parameters.index].invested
        const newValue = Number(parameters.newInvestment.value)

        // remove the previous investments values from whereIsTheMoney
        storageCopy.whereIsTheMoney.account.value += previousValue
        storageCopy.whereIsTheMoney.investments.value -= previousValue

        // add the new investments values to whereIsTheMoney
        storageCopy.whereIsTheMoney.account.value -= newValue
        storageCopy.whereIsTheMoney.investments.value += newValue

        // add the new values to the investment
        storageCopy.investments[parameters.index].name = parameters.newInvestment.name
        storageCopy.investments[parameters.index].start = parameters.newInvestment.date
        storageCopy.investments[parameters.index].invested = newValue
        storageCopy.investments[parameters.index].months[0] = {
            month: parameters.newInvestment.date,
            value: newValue
        }

        Storage.set(storageCopy)
    },
    update: (index, newMonth) => {
        let storageCopy = Storage.get()

        storageCopy.investments[index].months.push(newMonth)

        Storage.set(storageCopy)
    },
    toggleRedeem: index => {
        let storageCopy = Storage.get()
        const status = storageCopy.investments[index].status

        // if investment status is "ativo", 
        // change to "resgatado", otherwise to "ativo"
        storageCopy.investments[index]
            .status = status === "ativo" ? "resgatado" : "ativo"

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