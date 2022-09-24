import Storage from "./storage.js";
import TransactionsFunctions from "./transactionsFunctions.js";
import Utils from "./utils.js";

const App = {
    init: () => {
        if (Storage.get().transactions.length !== 0) {
            DOM.setMonthsOptions()
            DOM.setMonthTitle()
            DOM.setGeneralInfo(Storage.get().transactions)
            DOM.setMonthTable(Storage.get().transactions)
        }
        DOM.modal.cleanFields()
    },
    reload: () => {
        App.init()
    },
    secondaryReload: () => {
        DOM.setGeneralInfo(Storage.get().transactions)
        DOM.setMonthTitle()
        DOM.setMonthTable(Storage.get().transactions)
    }
}

const DOM = {
    getFilterMonth: () => document.querySelector("#month-select").value,
    setMonthTitle: () => {
        document.querySelectorAll(".month-title").forEach(element => {
            element.textContent =
                Utils.formatDateToMonthName(DOM.getFilterMonth()) + " de " + DOM.getFilterMonth().substring(3)
        })
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
    setMonthTable: transactions => {
        document.querySelector("table tbody")
            .innerHTML = transactions.map(transaction => {
                if (transaction.date.substring(3) === DOM.getFilterMonth()) {
                    return `
                        <tr data-index='${transactions.indexOf(transaction)}'>
                            <td>${transaction.date.substring(0, 2)}</td>
                            <td>${transaction.description}</td>
                            <td>${Utils.formatValueToCurrency(transaction.value)}</td>
                            <td class="table-more-info-button">
                                <abbr title="Mais informações">
                                    <div></div><div></div><div></div>
                                </abbr>
                            </td>
                        </tr>
                    `
                }
            }).join("")
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
            DOM.updateTotalValue()
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
    },
    updateTotalValue: () => {
        let total = 0
        document.querySelectorAll(".payment-method input").forEach(input => {
            total += Number(input.value)
        })

        document.querySelector(".transaction-info .value")
            .textContent = Utils.formatValueToCurrency(total)
    },
    moreInfoModal: {
        open: (index) => {
            const transaction = Storage.get().transactions[index]

            document.querySelector(".more-info-modal")
                .classList.add("active")

            document.querySelector(".more-info-modal").dataset.index = index

            document.querySelector(".more-info-modal .title").textContent = "Mais informações de " + transaction.description

            const paragraphs = [...document.querySelectorAll(".more-info-modal p")]
                .map(p => p)

            paragraphs[0].textContent = Utils.formatValueToCurrency(transaction.paymentMethods.account)
            paragraphs[1].textContent = Utils.formatValueToCurrency(transaction.paymentMethods.cash)
            paragraphs[2].textContent = Utils.formatValueToCurrency(transaction.paymentMethods.coin)
            paragraphs[3].textContent = transaction.date
            paragraphs[4].textContent = transaction.description
            paragraphs[5].textContent = Utils.formatValueToCurrency(transaction.value)
        },
        close: () => {
            document.querySelector(".more-info-modal")
                .classList.remove("active")
        }
    },
    alertModal: {
        open: (
            // function to do
            func,
            // function parameter
            parameter,
            // message to show on alertModal
            message
        ) => {
            document.querySelector(".alert-modal")
                .classList.add("active")
            document.querySelector(".alert-modal .container h2")
                .textContent = message

            document.querySelector(".yes-button")
                .addEventListener("click", () => {
                    func(parameter)
                    DOM.alertModal.close()
                })
            document.querySelector(".no-button")
                .addEventListener("click", () => DOM.alertModal.close())
        },
        close: () => {
            document.querySelector(".alert-modal")
                .classList.remove("active")
        }
    }
}

App.init()

// recarega as informações quando muda de mês
document.querySelector("#month-select")
    .addEventListener("change", () => App.secondaryReload())

// abre o modal
document.querySelector(".add-button")
    .addEventListener("click", () => DOM.modal.open())

// adiciona uma nova transação
document.querySelector("form")
    .addEventListener("submit", event => DOM.validadeFields(event))

// atualiza o valor do modal quando os metodos de pagamento são alterados
document.querySelectorAll(".payment-method input").forEach(input => {
    input.addEventListener("keyup", () => DOM.updateTotalValue())
})

// fecha o modal quando pressionado ESC ou clicado no botão fechar
window.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        DOM.modal.close()
    }
})

document.querySelector(".close-modal-button")
    .addEventListener("click", () => DOM.modal.close())

// open more info modal 
document.querySelectorAll(".table-more-info-button").forEach(element => {
    element.addEventListener("click", event => {
        DOM.moreInfoModal.open(event.currentTarget.parentElement.dataset.index)
    })
})

// close more info modal 
document.querySelector(".close-more-info-modal")
    .addEventListener("click", () => DOM.moreInfoModal.close())