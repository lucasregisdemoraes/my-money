import Utils from "./utils.js"
import TransactionsFunctions from "./transactionsFunctions.js"


//  adicionar função app init e reload

// adicionar função para adicionar transação


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

const Storage = {
    get: () => {
        return localStorage.getItem("data") || {
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
        localStorage.setItem(JSON.stringify(data))
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

            let content = ""

            switch (modalType) {
                case "new-income":
                    content = `
                        <h2>Adicionar Novo Ganho</h2>
                        <form action="">
                            <h3>Local do Pagamento</h3>
                            <div class="payment-locals">
                                <label for="account" class="payment-local">
                                    <p>Conta</p>
                                    <input type="radio" name="a" id="account">
                                </label>
                                <label for="cash" class="payment-local">
                                    <p>Dinheiro</p>
                                    <input type="radio" name="a" id="cash">
                                </label>
                                <label for="coin" class="payment-local">
                                    <p>Moeda</p>
                                    <input type="radio" name="a" id="coin">
                                </label>
                            </div>
                            <div class="transaction-info">
                                <div>
                                    <label for="">Valor</label>
                                    <input type="number">
                                </div>
                                <div>
                                    <label for="">Data</label>
                                    <input type="text">
                                </div>
                                <div>
                                    <label for="">Descrição</label>
                                    <input type="text">
                                </div>
                            </div>
                            <button type="submit">Confirmar</button>
                        </form>
                    `
                    break;
                case "new-expense":
                    content = `
                        <h2>Adicionar Nova Despesa</h2>
                        <form action="">
                            <h3>Metodo de Pagamento</h3>
                            <div class="payment-methods">
                                <details class="payment-method">
                                    <summary>Conta</summary>
                                    <input type="number" id="account">
                                </details>
                                <details class="payment-method">
                                    <summary>Dinheiro</summary>
                                    <input type="number" id="cash">
                                </details>
                                <details class="payment-method">
                                    <summary>Moeda</summary>
                                    <input type="number" id="coin">
                                </details>
                            </div>
                            <div class="transaction-info">
                                <div>
                                    <h3 class="value">Valor</h3>
                                    <p>R$00,00</p>
                                </div>
                                <div>
                                    <label for="">Data</label>
                                    <input type="text">
                                </div>
                                <div>
                                    <label for="">Descrição</label>
                                    <input type="text">
                                </div>
                            </div>
                            <button type="submit">Confirmar</button>
                        </form>
                        `
                    break
                case "new-investiment":
                    content = `
                        <h2>Adicionar Novo Investimento</h2>
                        <form action="">
                            <div class="transaction-info">
                                <div>
                                    <label for="">Valor</label>
                                    <input type="number">
                                </div>
                                <div>
                                    <label for="">Data</label>
                                    <input type="text">
                                </div>
                                <div>
                                    <label for="">Descrição</label>
                                    <input type="text">
                                </div>
                            </div>
                            <button type="submit">Confirmar</button>
                        </form>
                            `
                    break
                default:
                    break;
            }

            document.querySelector(".modal .container").innerHTML = content
        },
        close: (event) => {
            event.preventDefault()
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