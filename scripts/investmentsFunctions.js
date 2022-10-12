import Storage from "./storage.js";

export default {
    new: newInvestment => {
        let storageCopy = Storage.get()

        storageCopy.investments.push({
            name: newInvestment.name,
            start: newInvestment.date,
            invested: newInvestment.value,
            months: [
                {
                    month: newInvestment.date.substring(3),
                    value: newInvestment.value
                }
            ],
            status: "ativo"
        })

        storageCopy.whereIsTheMoney.account.value -= newInvestment.value
        storageCopy.whereIsTheMoney.investments.value += newInvestment.value

        Storage.set(storageCopy)
    }
}