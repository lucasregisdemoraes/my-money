import Utils from "./utils.js"
import TransactionsFunctions from "./transactionsFunctions.js"
import InvestmentsFunctions from "./investmentsFunctions.js"
import Storage from "./storage.js"

const App = {
    init: () => {
        DOM.setWhereIsTheMoney(Storage.get().whereIsTheMoney)
        DOM.setInvestmentsCards(Storage.get().investments)
        DOM.setInvestmentsTable(Storage.get().investments)
        DOM.setAnnualTable(Storage.get().transactions)
    },
    reload: () => {
        App.init()
        DOM.newTransactionModal.close()
        DOM.newInvestmentModal.close()
        DOM.newTransferModal.close()
    }
}

const DOM = {
    setWhereIsTheMoney: items => {
        let elements = ""
        for (const item in items) {
            elements += `
                <div class="card">
                    <h3>${items[item].name}</h3>
                    <p>${Utils.formatValueToCurrency(items[item].value)}</p>
                </div>
            `
        }

        document.querySelector("#whereIsTheMoneyDiv")
            .innerHTML = elements
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
    setInvestmentsCards: investments => {
        const cards = document.querySelectorAll("#investmentsSection .card")
        const cardsInfo = [
            investments.reduce((total, investment) =>
                total + investment.invested, 0),
            investments.reduce((total, investment) =>
                total + InvestmentsFunctions.getLastMonthIncome(investment, "value"), 0),
            investments.reduce((total, investment) =>
                total + InvestmentsFunctions.getLastMonthIncome(investment, "percentage"), 0),
            investments.reduce((total, investment) =>
                total + InvestmentsFunctions.getTotalIncome(investment, "value"), 0),
            investments.reduce((total, investment) =>
                total + InvestmentsFunctions.getTotalIncome(investment, "percentage"), 0),
        ]

        for (let i = 0; i < 5; i++) {
            if (i === 1 || i === 4) {
                cards[i].lastElementChild.textContent = cardsInfo[i].toFixed(2) + "%"
            } else {
                cards[i].lastElementChild.textContent = Utils.formatValueToCurrency(cardsInfo[i])
            }
        }
    },
    setInvestmentsTable: items => {
        document.querySelector("#investmentsSection table tbody").innerHTML = items.map(item => {
            if (item.status === "ativo") {
                return `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.start}</td>
                        <td>${Utils.formatValueToCurrency(item.invested)}</td>
                        <td>${Utils.formatValueToCurrency(InvestmentsFunctions.getLastMonthIncome(item, "value"))}</td>
                        <td>${InvestmentsFunctions.getLastMonthIncome(item, "percentage").toFixed(2)}%</td>
                        <td>${Utils.formatValueToCurrency(InvestmentsFunctions.getTotalIncome(item, "value"))}</td>
                        <td>${InvestmentsFunctions.getTotalIncome(item, "percentage").toFixed(2)}%</td>
                    </tr>
                `
            }
        }).join("")


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
    newTransactionModal: {
        open: () => {
            document.querySelector(".new-transaction-modal").classList.add("active")
            document.querySelector(".add-button-div .buttons").classList.remove("active")

            document.querySelector(".new-transaction-modal form").onsubmit = event => {
                event.preventDefault()

                const inputs = [...document.querySelectorAll(".new-transaction-modal form input")]
                    .map(input => input)

                const newTransaction = {
                    paymentMethods: {
                        account: Number(inputs[0].value),
                        cash: Number(inputs[1].value),
                        coin: Number(inputs[2].value)
                    },
                    value: Number(inputs[0].value) + Number(inputs[1].value) + Number(inputs[2].value),
                    date: Utils.convertDateFormat(inputs[3].value, "-", "/"),
                    description: inputs[4].value
                }

                if (inputs[0].value === "" && inputs[1].value === "" && inputs[2].value === "") {
                    alert("Por favor, insira um valor")
                } else if (inputs[3].value === "") {
                    alert("Por favor, insira uma data")
                } else if (inputs[4].value === "") {
                    alert("Por favor, insira uma descrição")
                } else {
                    TransactionsFunctions.new({
                        newTransaction: newTransaction
                    })
                    App.reload()
                }
            }
        },
        close: () => {
            document.querySelector(".new-transaction-modal").classList.remove("active")
        }
    },
    newInvestmentModal: {
        open: () => {
            document.querySelector(".new-investment-modal").classList.add("active")
            document.querySelector(".add-button-div .buttons").classList.remove("active")

            document.querySelector(".new-investment-modal form").onsubmit = event => {
                event.preventDefault()

                const inputs = [...document.querySelectorAll(".new-investment-modal input")]

                const newInvestment = {
                    name: inputs[0].value,
                    value: Number(inputs[1].value),
                    date: Utils.convertDateFormat(inputs[2].value, "-", "/"),
                }

                if (inputs[0].value === "") {
                    alert("Por favor, insira um nome")
                } else if (inputs[1].value === "") {
                    alert("Por favor, insira um valor")
                } else if (Number(inputs[1].value) > Storage.get().whereIsTheMoney.account.value) {
                    alert("Por favor, insira um valor menor, o valor inserido é maior que o disponivel na conta")
                } else if (Number(inputs[1].value) < 0) {
                    alert("Por favor, insira um valor positivo")
                } else if (inputs[2].value === "") {
                    alert("Por favor, insira uma data de inicio")
                } else {
                    InvestmentsFunctions.new(newInvestment)
                    App.reload()
                }
            }
        },
        close: () => {
            document.querySelector(".new-investment-modal").classList.remove("active")
        }
    },
    newTransferModal: {
        open: () => {
            document.querySelector(".new-transfer-modal").classList.add("active")
            document.querySelector(".add-button-div .buttons").classList.remove("active")

            document.querySelector(".new-transfer-modal form").onsubmit = event => {
                event.preventDefault()
                const value = Number(document.querySelector("#transfer-value").value)
                const from = [...document.getElementsByName("from")]
                    .find(element => element.checked)
                const to = [...document.getElementsByName("to")]
                    .find(element => element.checked)

                    let storageCopy = Storage.get()

                if (from === undefined) {
                    alert("Por favor, selecione o local de onde fazer a transferência")
                } else if (value === "") {
                    alert("Por favor, insira um valor")
                } else if (value <= 0) {
                    alert("Por favor, insira um valor maior que 0")
                } else if(value > storageCopy.whereIsTheMoney[from.value].value) {
                    alert(`Por favor, insira um valor maior menor ou igual ao disponível em: ${storageCopy.whereIsTheMoney[from.value].name}
                                Valor disponível: ${Utils.formatValueToCurrency(storageCopy.whereIsTheMoney[from.value].value)}`)
                } else if (to === undefined) {
                    alert("Por favor, selecione o local para onde fazer a transferência")
                } else {
                    storageCopy.whereIsTheMoney[from.value].value -= value
                    storageCopy.whereIsTheMoney[to.value].value += value

                    Storage.set(storageCopy)

                    App.reload()
                }
            }
        },
        close: () => {
            document.querySelector(".new-transfer-modal").classList.remove("active")
        },
    },
    toogleAddButtonOptions: () => {
        document.querySelector(".add-button-div .buttons").classList.toggle("active")
    }
}

// ==============================

// open add button options
document.querySelector(".add-button").addEventListener("click", () => DOM.toogleAddButtonOptions())

// open new transaction modal
document.querySelector("#new-transaction-button")
    .onclick = () => DOM.newTransactionModal.open()

// open new investment modal
document.querySelector("#new-investment-button")
    .onclick = () => DOM.newInvestmentModal.open()

// open new transfer modal
document.querySelector("#new-transfer-button")
    .onclick = () => DOM.newTransferModal.open()

// close modals when click on close modal button or press ESC
window.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        DOM.newTransactionModal.close()
        DOM.newInvestmentModal.close()
        DOM.newTransferModal.close()
    }
})

document.querySelectorAll(".close-modal-button").forEach(button => {
    button.onclick = () => {
        DOM.newTransactionModal.close()
        DOM.newInvestmentModal.close()
        DOM.newTransferModal.close()
    }
})

App.init()