import Storage from "./storage.js";
import TransactionsFunctions from "./transactionsFunctions.js";
import Utils from "./utils.js";

const App = {
    init: () => {
        if (Storage.get().transactions.length !== 0) {
            DOM.setMonthsOptions()
            DOM.setMonthTitle()
            DOM.setGeneralInfo(Storage.get().transactions)
        }
    },
    reload: () => {
        App.init()
    },
    secondaryReload: () => {
        DOM.setGeneralInfo(Storage.get().transactions)
        DOM.setMonthTitle()
    }
}

const DOM = {
    getFilterMonth: () => document.querySelector("#month-select").value,
    setMonthTitle: () => {
        document.querySelector("#month-title")
            .textContent =
            Utils.formatDateToMonthName(DOM.getFilterMonth()) + " de " + DOM.getFilterMonth().substring(3)
    },
    setGeneralInfo: (transactions) => {
        const paragraphs = [...document.querySelectorAll("#general-info-section .cards .card p")].map(p => p)
        paragraphs[0].textContent =
            Utils.formatValueToCurrency(TransactionsFunctions.incomesSumByMonth(transactions, DOM.getFilterMonth()))
        paragraphs[1].textContent =
            Utils.formatValueToCurrency(TransactionsFunctions.expensesSumByMonth(transactions, DOM.getFilterMonth()))
        paragraphs[2].textContent =
            Utils.formatValueToCurrency(TransactionsFunctions.totalByMonth(transactions, DOM.getFilterMonth()))
    },
    setMonthsOptions: () => {
        document.querySelector("#month-select").innerHTML =
            Utils.getMonthsFromTransactions(Storage.get().transactions).map(month => `
                <option value="${month}" selected>${month}</option>
            `)
    },
    modal: {
        open: () => {
            document.querySelector(".modal").classList.add("active")
        },
        cleanFields: () => {
            document.querySelectorAll("form input").forEach(input => {
                input.value = ""
            })
        },
        close: () => {
            document.querySelector(".modal").classList.remove("active")
            DOM.modal.cleanFields()
        }
    },
    validadeFields: (event) => {
        event.preventDefault()
        const inputsValue =
            [...document.querySelectorAll("form input")].map(input => input.value)

        if (inputsValue[0] === "" && inputsValue[1] === "" && inputsValue[2] === "") {
            alert("Por favor, insira um valor")
        } else if (inputsValue[3] === "") {
            alert("Por favor, insira uma data")
        } else if (inputsValue[4] === "") {
            alert("Por favor, insira uma descrição")
        } else {
            TransactionsFunctions.new(event)
            DOM.modal.close()
            App.reload()
        }
    }
}

// recarega as informações quando muda de mês
document.querySelector("#month-select")
    .addEventListener("change", () => App.secondaryReload())

// abre o modal
document.querySelector(".add-button")
    .addEventListener("click", () => DOM.modal.open())

// adiciona uma nova transação
document.querySelector("form")
    .addEventListener("submit", event => DOM.validadeFields(event))

App.init()