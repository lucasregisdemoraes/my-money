import Utils from "./utils.js"
import TransactionsFunctions from "./transactionsFunctions.js"
import Storage from "./storage.js"

// let data = {
//     whereIsTheMoney: [
//         {
//             name: "conta",
//             value: 0
//         },
//         {
//             name: "dinheiro",
//             value: 0
//         },
//         {
//             name: "moeda",
//             value: 0
//         },
//         {
//             name: "investimentos",
//             value: 0
//         }
//     ],
//     investments: [
//         {
//             name: "investimento1",
//             start: "00/00/00",
//             invested: 0,
//             lastMonthIncome: 0,
//             lastMonthIncomePercentage: 0,
//             totalIncome: 0,
//             totalIncomePercentage: 0
//         }
//     ],
//     transactions: [
//         {
//             date: "01/01/01",
//             description: "abcde",
//             value: 100,
//         }
//     ]
// }

const App = {
    init: () => {
        DOM.setWhereIsTheMoney(Storage.get().whereIsTheMoney)
        DOM.setInvestments(Storage.get().investments)
        DOM.setAnnualTable(Storage.get().transactions)
    }
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
    },
    modal: {
        open: modalType => {
            document.querySelector(".modal").classList.add("active")
            document.querySelector(".add-button-div .buttons").classList.remove("active")

            let title = ""
            let content = ""

            if (modalType === "new-investment") {
                title = "Adicionar Novo Investimento"
                content = `
                    <div class="transaction-info">
                        <div>
                            <label for="value">Valor</label>
                            <input name="value" type="number">
                        </div>
                        <div>
                            <label for="date">Data</label>
                            <input name="date" type="date">
                        </div>
                        <div>
                            <label for="description">Descrição</label>
                            <input name="description" type="text">
                        </div>
                    </div>
                    <button type="submit">Confirmar</button>
                    `
            } else {
                title = "Adicionar Nova Transação"
                content = `
                    <h3>Metodo de Pagamento</h3>
                        <div class="payment-methods">
                            <details class="payment-method">
                                <summary>Conta</summary>
                                <input type="number" name="account">
                            </details>
                            <details class="payment-method">
                                <summary>Dinheiro</summary>
                                <input type="number" name="cash">
                            </details>
                            <details class="payment-method">
                                <summary>Moeda</summary>
                                <input type="number" name="coin">
                            </details>
                        </div>
                        <div class="transaction-info">
                            <div>
                                <h3 class="value">Valor</h3>
                                <p>R$00,00</p>
                            </div>
                            <div>
                                <label for="date">Data</label>
                                <input name="date" type="date">
                            </div>
                            <div>
                                <label for="description">Descrição</label>
                                <input name="description" type="text">
                            </div>
                        </div>
                        <button type="submit">Confirmar</button>
                `
            }
       
            document.querySelector(".modal .container h2").innerHTML = title
            document.querySelector(".modal .container form").innerHTML = content
        },
        close: () => {
            document.querySelector(".modal").classList.remove("active")
        }
    },
    toogleAddButtonOptions: () => {
        document.querySelector(".add-button-div .buttons").classList.toggle("active")
    }
}

// ==============================

// open add button options
document.querySelector(".add-button").addEventListener("click", () => DOM.toogleAddButtonOptions())

// active selected payment local
document.querySelectorAll(".payment-local").forEach(element => {
    element.addEventListener("click", () => {
        document.querySelectorAll(".payment-local").forEach(e => {
            e.classList.remove("active")
        })
        element.classList.add("active")
    })
})

// open modal
document.querySelector("#new-income").addEventListener("click", () => DOM.modal.open("new-income"))
document.querySelector("#new-expense").addEventListener("click", () => DOM.modal.open("new-expense"))
document.querySelector("#new-investment").addEventListener("click", () => DOM.modal.open("new-investment"))

App.init()