export default {
    get: () => {
        return JSON.parse(localStorage.getItem("data")) || {
            whereIsTheMoney: [
                {
                    name: "conta",
                    value: 0
                },
                {
                    name: "dinheiro",
                    value: 0
                },
                {
                    name: "moeda",
                    value: 0
                },
                {
                    name: "investimentos",
                    value: 0
                }
            ],
            investments: [],
            transactions: []
        }
    },
    set: (data) => {
        localStorage.setItem("data", JSON.stringify(data))
    }
}