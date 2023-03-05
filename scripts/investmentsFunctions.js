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
                    value: Number(newInvestment.value),
                    invested: 0
                }
            ],
            status: "ativo"
        })

        Storage.set(storageCopy)
    },
    remove: index => {
        let storageCopy = Storage.get()
        const lastValue = Storage.get().investments[index]
            .months[Storage.get().investments[index].months.length - 1].value
        const status = storageCopy.investments[index].status
        let invested = storageCopy.investments[index].invested
        invested += storageCopy.investments[index].months.reduce((total, monthObject) =>
            total + monthObject.invested, 0)

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
    invest: (index, value, month) => {
        let storageCopy = Storage.get()
        const status = storageCopy.investments[index].status
        const monthIndex = Storage.get().investments[index].months.findIndex(item => {
            return item.month.substring(3) === month.substring(3)
        })

        storageCopy.investments[index].months[monthIndex].value += value
        storageCopy.investments[index].months[monthIndex].invested += value

        Storage.set(storageCopy)
    },
    toggleRedeem: index => {
        let storageCopy = Storage.get()
        const investment = storageCopy.investments[index]
        const status = storageCopy.investments[index].status
        const lastMonthValue = investment.months[investment.months.length - 1].value

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

            lastMonthIncome = (lastMonth.value - lastMonth.invested) - (penultMonth.value - penultMonth.invested)
            lastMonthIncomePercentage = lastMonthIncome / (penultMonth.value - penultMonth.invested) * 100
        }

        return type === "value" ? lastMonthIncome : lastMonthIncomePercentage
    },
    getTotalIncome: (investment, type) => {
        let totalIncome = 0
        let totalIncomePercentage = 0

        if (investment.months.length > 1) {
            const firstMonth = investment.months[0]
            const lastMonth = investment.months[investment.months.length - 1]
            let totalInvested = 0

            investment.months.forEach(month => {
                totalInvested += month.invested
            })


            totalIncome = (lastMonth.value - firstMonth.value) - totalInvested
            totalIncomePercentage = totalIncome / firstMonth.value * 100
        }

        return type === "value" ? totalIncome : totalIncomePercentage

    },
}