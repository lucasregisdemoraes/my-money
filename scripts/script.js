import Utils from "./utils.js"
import TransactionsFunctions from "./transactionsFunctions.js"

document.querySelector(".add-button-div .add-button").addEventListener("click", () => {
    document.querySelector(".add-button-div .buttons").classList.toggle("active")
})

let data = {
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
    investments: [
        {
            name: "investimento1",
            start: "00/00/00",
            invested: 0,
            lastMonthIncome: 0,
            lastMonthIncomePercentage: 0,
            totalIncome: 0,
            totalIncomePercentage: 0
        },
        {
            name: "investimento2",
            start: "00/00/00",
            invested: 0,
            lastMonthIncome: 0,
            lastMonthIncomePercentage: 0,
            totalIncome: 0,
            totalIncomePercentage: 0
        }
    ],
    transactions: [
        {
            date: "01/01/01",
            description: "abcde",
            value: 100,
        },
        {
            date: "01/01/01",
            description: "abcde",
            value: 100,
        },
        {
            date: "01/01/01",
            description: "abcde",
            value: -100,
        },
        {
            date: "01/02/01",
            description: "abcde",
            value: 100,
        }
    ]
}

const DOM = {
    setWhereIsTheMoney: items => {
        document.querySelector("#whereIsTheMoneyDiv").innerHTML = items.map(item => `
            <div class="card">
                <h3>${item.name}</h3>
                <p>${Utils.formatValueToCurrency(item.value)}</p>
            </div>
            `
        ).join("")

        // ======== OU ========

        // const container = document.querySelector("#whereIsTheMoneyDiv")
        // let elements = items.map(item => {
        //     return `
        //     <div class="card">
        //         <h3>${item.name}</h3>
        //         <p>${item.value}</p>
        //     </div>
        //     `
        // }).join("")
        // container.innerHTML = elements
    },
    setAnnualTable: transactions => {
        const trThead = document.querySelector("#annualSection table thead tr")
        const tbody = document.querySelector("#annualSection table tbody")

        let theadElements = "<th></th>" + Utils.getMonthsFromTransactions(transactions).map(month => `<th>${Utils.formatDateToMonthName(month)}</th>`).join("")

        let tbodyElements = `
            <tr>
                <td>Entradas</td>
                ${Utils.getMonthsFromTransactions(transactions).map(month => {
                    return `
                    <td>${Utils.formatValueToCurrency(TransactionsFunctions.incomesSumByMonth(transactions, month))}</td>
                    `
                }).join("")}
            </tr>
            <tr>
                <td>Saidas</td>
                ${Utils.getMonthsFromTransactions(transactions).map(month => {
                    return `
                    <td>${Utils.formatValueToCurrency(TransactionsFunctions.expensesSumByMonth(transactions, month))}</td>
                    `
                }).join("")}
            </tr>
            <tr>
                <td>Total</td>
                ${Utils.getMonthsFromTransactions(transactions).map(month => {
                    return `
                    <td>${Utils.formatValueToCurrency(TransactionsFunctions.totalByMonth(transactions, month))}</td>
                    `
                }).join("")}
            </tr>
            `




        trThead.innerHTML = theadElements
        tbody.innerHTML = tbodyElements
    },
    setInvestments: items => {
        document.querySelector("#investmentsSection table tbody").innerHTML = items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.start}</td>
                <td>${Utils.formatValueToCurrency(item.invested)}</td>
                <td>${Utils.formatValueToCurrency(item.lastMonthIncome)}</td>
                <td>${item.lastMonthIncomePercentage}%</td>
                <td>${Utils.formatValueToCurrency(item.totalIncome)}</td>
                <td>${item.totalIncome}%</td>
            </tr>
            `
        ).join("")

        // ======== OU ========

        // const container = document.querySelector("#investmentsSection table tbody")
        // let elements = items.map(item => {
        //   return  `
        //     <tr>
        //         <td>${item.name}</td>
        //         <td>${item.start}</td>
        //         <td>${Utils.formatValueToCurrency(item.invested)}</td>
        //         <td>${Utils.formatValueToCurrency(item.lastMonthIncome)}</td>
        //         <td>${item.lastMonthIncomePercentage}%</td>
        //         <td>${Utils.formatValueToCurrency(item.totalIncome)}</td>
        //         <td>${item.totalIncome}%</td>
        //     </tr>
        //     `
        // }).join("")
        // container.innerHTML = elements
    }
}

DOM.setWhereIsTheMoney(data.whereIsTheMoney)
DOM.setInvestments(data.investments)
DOM.setAnnualTable(data.transactions)