export default {
    get: () => {
        return JSON.parse(localStorage.getItem("data")) || {
            investments: [],
            transactions: []
        }
    },
    set: (data) => {
        localStorage.setItem("data", JSON.stringify(data))
    }
}