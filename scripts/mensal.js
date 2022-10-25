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
        DOM.modal.close()
        DOM.confirmationModal.close()
        DOM.moreInfoModal.close()

        // open more info modal 
        document.querySelectorAll(".table-item-button").forEach(element => {
            element.onclick = event => {
                DOM.moreInfoModal.open(event.currentTarget.parentElement.dataset.index)
            }
        })
    },
    reload: () => {
        App.init()
    },
    secondaryReload: () => {
        DOM.setGeneralInfo(Storage.get().transactions)
        DOM.setMonthTitle()
        DOM.setMonthTable(Storage.get().transactions)
        DOM.modal.cleanFields()
        DOM.modal.close()
        DOM.confirmationModal.close()
        DOM.moreInfoModal.close()
        
        // open more info modal 
        document.querySelectorAll(".table-item-button").forEach(element => {
            element.onclick = event => {
                DOM.moreInfoModal.open(event.currentTarget.parentElement.dataset.index)
            }
        })
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
                            <td class="table-item-button">
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
        open: (index) => {
            document.querySelector(".modal").classList.add("active")
            const inputs = [...document.querySelectorAll("form input")].map(input => input)

            // if index is not equals to undefined it means to open an edit modal
            // then set inputs value to current transaction info
            if (index !== undefined) {
                const transaction = Storage.get().transactions[index]
                inputs[0].value = transaction.paymentMethods.account
                inputs[1].value = transaction.paymentMethods.cash
                inputs[2].value = transaction.paymentMethods.coin
                DOM.updateTotalValue()
                inputs[3].value = Utils.convertDateFormat(transaction.date, "/", "-")
                inputs[4].value = transaction.description;

                [inputs[0], inputs[1], inputs[2]].forEach(input => {
                    // if input have some value set details element open
                    if (input.value !== "0") {
                        input.parentElement.open = true
                    }
                })
            }

            document.querySelector("form").onsubmit = (event) => {
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

                // if index is not equals to undefined it means to open an edit modal
                // then validate fields and use transaction edit function
                if (index !== undefined) {
                    const transaction = Storage.get().transactions[index]
                    DOM.validateFields({
                        event: event,
                        functionToDo: DOM.confirmationModal.open,
                        functionParameters: {
                            functionToDo: TransactionsFunctions.edit,
                            functionParameters: {
                                index: index,
                                newTransaction: newTransaction
                            },
                            message: `Deseja editar ${transaction.description}?`
                        },
                        reload: false
                    })

                } else {
                    // if it is not an edit modal validate fields and use new transaction function
                    DOM.validateFields({
                        event: event,
                        functionToDo: TransactionsFunctions.new,
                        functionParameters: {
                            newTransaction: newTransaction
                        },
                        reload: true
                    })

                }
            }
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
    validateFields: (parameters) => {
        // function parameters
        /* {
                event: event,
                functionToDo: ......,
                functionParameters: {}
                reload: ......
        } */
        parameters.event.preventDefault()
        const inputsValue =
            [...document.querySelectorAll("form input")].map(input => input.value)

        if (inputsValue[0] === "" && inputsValue[1] === "" && inputsValue[2] === "") {
            alert("Por favor, insira um valor")
        } else if (inputsValue[3] === "") {
            alert("Por favor, insira uma data")
        } else if (inputsValue[4] === "") {
            alert("Por favor, insira uma descrição")
        } else {
            parameters.functionToDo(parameters.functionParameters)
            if (parameters.reload === true) {
                App.reload()
            }
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
    confirmationModal: {
        open: (parameters) => {
            // function parameters
            /* {
                functionToDo: ......
                functionParameters: {}
                message: .......
            } */

            document.querySelector(".confirmation-modal")
                .classList.add("active")
            document.querySelector(".confirmation-modal .container h2")
                .textContent = parameters.message

            document.querySelector(".yes-button")
                .onclick = () => {
                    parameters.functionToDo(parameters.functionParameters)
                    App.secondaryReload()
                }
            document.querySelector(".no-button")
                .onclick = () => DOM.confirmationModal.close()
        },
        close: () => {
            document.querySelector(".confirmation-modal")
                .classList.remove("active")
        }
    }
}

App.init()

// recarega as informações quando muda de mês
document.querySelector("#month-select")
    .onchange = () => App.secondaryReload()

// abre o modal
document.querySelector(".add-button").onclick = () => DOM.modal.open()

// atualiza o valor do modal quando os metodos de pagamento são alterados
document.querySelectorAll(".payment-method input").forEach(input => {
    input.onkeyup = () => DOM.updateTotalValue()
})

// fecha o modal quando pressionado ESC ou clicado no botão fechar
// close more info modal 

window.onkeyup = e => {
    if (e.key === "Escape") {
        DOM.modal.close()
        DOM.moreInfoModal.close()
    }
}

document.querySelectorAll(".close-modal-button").forEach(button => {
    button.onclick = () => {
        DOM.moreInfoModal.close()
        DOM.modal.close()
    }
})

// open confirmationModal for remove confirmation
document.querySelector(".delete-button")
    .onclick = (event) => DOM.confirmationModal.open(
        {
            functionToDo: TransactionsFunctions.remove,
            // get moreInfoModal transaction index
            functionParameters: event.currentTarget.parentElement.parentElement.dataset.index,
            message: `Deseja deletar a transação?`
        }
    )

document.querySelector(".edit-button")
    .onclick = (event) => {
        DOM.moreInfoModal.close()
        DOM.modal
            .open(event.currentTarget.parentElement.parentElement.dataset.index)
    }