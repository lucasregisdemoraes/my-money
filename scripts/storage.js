export default {
    get: () => {
        return JSON.parse(localStorage.getItem("data")) || {
            whereIsTheMoney: {
                account: {
                    name: "conta",
                    value: 0
                },
                cash: {
                    name: "dinheiro",
                    value: 0
                },
                coin: {
                    name: "moeda",
                    value: 0
                },
                investments: {
                    name: "investimentos",
                    value: 0
                }
            },
            investments: [],
            transactions: []
        }
    },
    set: (data) => {
        localStorage.setItem("data", JSON.stringify(data))
    }
}