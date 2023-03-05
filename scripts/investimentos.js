import Storage from "./storage.js";
import Utils from "./utils.js"
import InvestmentsFunctions from "./investmentsFunctions.js";

const App = {
    init: () => {
        const status = DOM.getStatus()
        const investments = status === "ativo" || status === "resgatado"
            ?
            Storage.get().investments.filter(investment =>
                investment.status === status
            )
            :
            Storage.get().investments

        DOM.setCards(investments)
        DOM.setTable(investments)

        // open investment options 
        document.querySelectorAll(".table-item-button").forEach(element => {
            element.onclick = event => {
                const index = event.currentTarget.parentElement.dataset.index
                DOM.moreInfoModal.open(index)
            }
        })
    },
    reload: () => {
        const status = DOM.getStatus()
        const investments = status === "ativo" || status === "resgatado"
            ?
            Storage.get().investments.filter(investment =>
                investment.status === status
            )
            :
            Storage.get().investments

        DOM.setCards(investments)
        DOM.setTable(investments)
        DOM.mainModal.close()
        DOM.mainModal.clearFields()
        DOM.moreInfoModal.close()
        DOM.updateInvestmentModal.close()
        DOM.investModal.close()

        // open investment options 
        document.querySelectorAll(".table-item-button").forEach(element => {
            element.onclick = event => {
                const index = event.currentTarget.parentElement.dataset.index
                DOM.moreInfoModal.open(index)
            }
        })
    }
}

const DOM = {
    getStatus: () => {
        return document.querySelector("#status-select").value
    },
    getDetailType: () => {
        return document.querySelector("#detail-select").value
    },
    setCards: (investments) => {
        const cards = [...document.querySelectorAll(".card")]

        cards[0].lastElementChild.textContent = Utils
            .formatValueToCurrency(investments.reduce((total, investment) =>
                total + investment.invested, 0))
        cards[1].lastElementChild.textContent = Utils
            .formatValueToCurrency(investments.reduce((total, investment) =>
                total + InvestmentsFunctions.getLastMonthIncome(investment, "value"), 0))
        cards[2].lastElementChild.textContent = Utils
            .formatValueToCurrency(investments.reduce((total, investment) =>
                total + InvestmentsFunctions.getLastMonthIncome(investment, "percentage"), 0))
        cards[3].lastElementChild.textContent = Utils
            .formatValueToCurrency(investments.reduce((total, investment) =>
                total + InvestmentsFunctions.getTotalIncome(investment, "value"), 0))
        cards[4].lastElementChild.textContent = Utils
            .formatValueToCurrency(investments.reduce((total, investment) =>
                total + InvestmentsFunctions.getTotalIncome(investment, "percentage"), 0))

        if (document.querySelector("#detail-select").value === "simple") {
            cards[3].style.display = "none"
            cards[4].style.display = "none"
        } else {
            cards[3].style.display = "block"
            cards[4].style.display = "block"
        }
    },
    setTable: investments => {
        const detailType = DOM.getDetailType()

        document.querySelector("table thead").innerHTML = detailType === "simple" ? `
            <tr>
                <th>Nome</th>
                <th>Rend. do último mês</th>
                <th>% Rend. do último mês</th>
            </tr>
        ` : `
            <tr>
                <th>Nome</th>
                <th>Inicio</th>
                <th>Investido</th>
                <th>Rend. do último mês</th>
                <th>% Rend. do último mês</th>
                <th>Rend. total</th>
                <th>% Rend. total</th>
                <th></th>
            </tr>
        
        `

        document.querySelector("table tbody").innerHTML = investments.map(investment => {
            return detailType === "simple" ? `
                <tr data-index='${investments.indexOf(investment)}'>
                    <td>${investment.name}</td>
                    <td>${Utils.formatValueToCurrency(InvestmentsFunctions.getLastMonthIncome(investment, "value"))}</td>
                    <td>${InvestmentsFunctions.getLastMonthIncome(investment, "percentage").toFixed(2)}%</td>
                    <td class="table-item-button">
                        <abbr title="Mais informações">
                            <div></div><div></div><div></div>
                        </abbr>
                    </td>
                </tr>
            ` : `
                <tr data-index='${investments.indexOf(investment)}'>
                    <td>${investment.name}</td>
                    <td>${investment.start}</td>
                    <td>${Utils.formatValueToCurrency(investment.invested)}</td>
                    <td>${Utils.formatValueToCurrency(InvestmentsFunctions.getLastMonthIncome(investment, "value"))}</td>
                    <td>${InvestmentsFunctions.getLastMonthIncome(investment, "percentage").toFixed(2)}%</td>
                    <td>${Utils.formatValueToCurrency(InvestmentsFunctions.getTotalIncome(investment, "value"))}</td>
                    <td>${InvestmentsFunctions.getTotalIncome(investment, "percentage").toFixed(2)}%</td>
                    <td class="table-item-button">
                        <abbr title="Opções">
                            <div></div><div></div><div></div>
                        </abbr>
                    </td>
                </tr>
            `
        }).join("")
    },
    mainModal: {
        open: index => {
            document.querySelector(".main-modal").classList.add("active")
            const inputs = [...document.querySelectorAll(".main-modal form input")]

            // if index is not equals to undefined it means to open an edit modal
            // then set inputs value to current investment info
            if (index !== undefined) {
                document.querySelector(".main-modal h2").textContent = "Editar investimento"
                inputs[0].value = Storage.get().investments[index].name
                inputs[1].value = Storage.get().investments[index].invested
                inputs[2].value = Utils.convertDateFormat(Storage.get().investments[index].start, "/", "-")
            } else {
                document.querySelector(".main-modal h2").textContent = "Adicionar Novo Investimento"
            }

            document.querySelector(".main-modal form").onsubmit = event => {
                event.preventDefault()

                const investment = {
                    name: inputs[0].value,
                    value: inputs[1].value,
                    date: Utils.convertDateFormat(inputs[2].value, "-", "/"),
                }

                try {
                    // if index is not equals to undefined it means to open an edit modal
                    // then validate fields and use investment edit function
                    if (index !== undefined) {
                        DOM.validateFields({
                            functionToDo: DOM.confirmationModal.open,
                            functionParameter: {
                                functionToDo: InvestmentsFunctions.edit,
                                functionParameters: {
                                    index: index,
                                    newInvestment: investment
                                },
                                message: `Deseja editar ${investment.name}?`
                            }
                        })
                    } else {
                        // if it is not an edit modal validate fields and use new investment function
                        if ((Utils.getTotalValue().account.value - Number(investment.value)) < 0) {
                            alert(`Por favor, insira um valor menor, o valor inserido é maior que o disponível na conta
                                    Valor disponível: ${Utils.formatValueToCurrency(Utils.getTotalValue().account.value)}`)
                        } else if (Number(investment.value) < 0) {
                            alert("Por favor, insira um valor positivo")
                        } else {
                            DOM.validateFields({
                                functionToDo: InvestmentsFunctions.new,
                                functionParameter: investment
                            })
                        }
                    }
                } catch (error) {
                    alert(error.message)
                }
            }
        },
        close: () => {
            document.querySelector(".main-modal")
                .classList.remove("active")
        },
        clearFields: () => {
            document.querySelectorAll(".main-modal form input")
                .forEach(input => input.value = "")
        }
    },
    validateFields: (parameter) => {
        // {
        //  functionToDo: ......,
        //  functionParameter: .......
        // }

        const inputsValue =
            [...document.querySelectorAll("form input")].map(input => input.value)

        if (inputsValue[0] === "") {
            throw new Error("Por favor, insira um nome")
        } else if (inputsValue[1] === "") {
            throw new Error("Por favor, insira um valor")
        } else if (isNaN(inputsValue[1])) {
            throw new Error("Por favor, insira um valor numérico")
        } else if (inputsValue[2] === "") {
            throw new Error("Por favor, insira uma data")
        }
        parameter.functionToDo(parameter.functionParameter)
        App.reload()
    },
    moreInfoModal: {
        open: index => {
            const investment = Storage.get().investments[index]

            document.querySelector(".more-info-modal")
                .classList.add("active")

            /*  if investment is already redeemed show "Desfazer resgatar investimento",
            otherwise show "Resgatar investimento" */
            document.querySelector(".more-info-modal .toggle-redeem-button")
                .textContent = investment.status === "ativo" ?
                    "Resgatar investimento" : "Desfazer resgatar investimento"

            // add index data set to all buttons in modal
            document.querySelectorAll(".more-info-modal button")
                .forEach(button => button.dataset.index = index)

            document.querySelector(".more-info-modal .title").textContent = investment.name

            const paragraphs = [...document.querySelectorAll(".more-info-modal p")]
                .map(p => p)

            paragraphs[0].textContent = investment.start
            paragraphs[1].textContent = Utils.formatValueToCurrency(investment.invested)
            paragraphs[2].textContent = investment.status

            document.querySelector(".more-info-modal ul")
                .innerHTML = investment.months.map(month => `
                    <li>
                        <p>${month.month}</p>
                        <p>${Utils.formatValueToCurrency(month.value)}</p>
                    </li>
                `)


        },
        close: () => {
            document.querySelector(".more-info-modal")
                .classList.remove("active")
        }
    },
    confirmationModal: {
        open: parameters => {
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
                    App.reload()
                    DOM.confirmationModal.close()
                }
            document.querySelector(".no-button")
                .onclick = () => DOM.confirmationModal.close()
        },
        close: () => {
            document.querySelector(".confirmation-modal")
                .classList.remove("active")
        }
    },
    updateInvestmentModal: {
        open: index => {
            document.querySelector(".update-modal").classList.add("active")

            const valueInput = document.querySelector(".update-modal input[name='value']")
            const monthInput = document.querySelector(".update-modal input[name='month']")
            const lastMonthValue = Storage.get().investments[index]
                .months[Storage.get().investments[index]
                    .months.length - 1].value

            document.querySelector(".update-modal form").onsubmit = event => {
                event.preventDefault()

                const monthExists = Storage.get().investments[index]
                    .months.find(monthObject => {
                        return monthObject.month.substring(3) === Utils.convertDateFormat(monthInput.value, "-", "/").substring(3)
                    })

                try {
                    if (valueInput.value === "") {
                        throw new Error("Por favor, insira um valor")
                    } else if (isNaN(valueInput.value)) {
                        throw new Error("Por favor, insira um valor numérico")
                    } else if (monthInput.value === "") {
                        throw new Error("Por favor, insira um mês")
                    } else if (monthExists) {
                        throw new Error("Por favor, insira um mês ainda não inserido")
                    } else if (valueInput.value < lastMonthValue) {
                        throw new Error(`Por favor, insira um valor maior que o atual
                        Valor atual: ${Utils.formatValueToCurrency(lastMonthValue)}`)
                    } else {
                        const newMonth = {
                            month: Utils.convertDateFormat(monthInput.value, "-", "/"),
                            value: Number(valueInput.value),
                            invested: 0
                        }

                        InvestmentsFunctions.update(index, newMonth)
                        DOM.updateInvestmentModal.clearFields()
                        App.reload()
                    }
                } catch (error) {
                    alert(error.message)
                }
            }
        },
        close: () => {
            document.querySelector(".update-modal").classList.remove("active")
        },
        clearFields: () => {
            document.querySelector(".update-modal input[name='value']").value = ""
            document.querySelector(".update-modal input[name='month']").value = ""
        }
    },
    investModal: {
        open: index => {
            document.querySelector(".invest-modal").classList.add("active")

            document.querySelector(".invest-modal form").onsubmit = event => {
                event.preventDefault()

                const value = Number(document.querySelector(".invest-modal form input[name='value'").value)
                let month = document.querySelector(".invest-modal form input[name='month'").value
                month = Utils.convertDateFormat(month, "-", "/")
                const accountValue = Utils.getTotalValue().account.value
                const previousValue = Storage.get().investments[index].invested
                const monthExists = Storage.get().investments[index].months.find(item => {
                    return item.month.substring(3) === month.substring(3)
                })

                try {
                    if (value === "") {
                        throw new Error("Por favor, insira um valor")
                    } else if (isNaN(value)) {
                        throw new Error("Por favor, insira um valor numérico")
                    } else if (value > accountValue) {
                        throw new Error(`Por favor, insira um valor menor que o disponível na conta
                Dinheiro disponivel: ${Utils.formatValueToCurrency(accountValue)}`)
                    } else if (month === "") {
                        throw new Error("Por favor, insira um mês")
                    } else if (!monthExists) {
                        throw new Error(`Por favor, insira um mês existente nesse investimento
                        meses existentes: ${Storage.get().investments[index].months
                                .map(month => month.month.substring(3))
                            }`)
                    } else {
                        InvestmentsFunctions.invest(index, value, month)
                        DOM.investModal.clearFields()
                        App.reload()
                    }
                } catch (error) {
                    alert(error.message)
                }
            }
        },
        close: () => {
            document.querySelector(".invest-modal").classList.remove("active")
        },
        clearFields: () => {
            document.querySelector(".invest-modal input[name='value']").value = ""
            document.querySelector(".invest-modal input[name='month']").value = ""
        }
    }
}

document.querySelector("#status-select").onchange = () => App.reload()

document.querySelector("#detail-select").onchange = () => App.reload()

// open new investment modal
document.querySelector(".add-button").onclick = () => DOM.mainModal.open()

// close modals when click close button or press ESC key
window.onkeyup = e => {
    if (e.key === "Escape") {
        DOM.mainModal.close()
        DOM.moreInfoModal.close()
        DOM.updateInvestmentModal.close()
        DOM.investModal.close()
    }
}

document.querySelectorAll(".close-modal-button").forEach(button => {
    button.onclick = () => {
        DOM.mainModal.close()
        DOM.moreInfoModal.close()
        DOM.updateInvestmentModal.close()
        DOM.investModal.close()
    }
})

document.querySelector(".delete-button")
    .onclick = event => DOM.confirmationModal.open({
        functionToDo: InvestmentsFunctions.remove,
        functionParameters: event.currentTarget.dataset.index,
        message: `Deseja deletar o investimento?`
    })

document.querySelector(".edit-button").onclick = event => {
    DOM.mainModal.open(event.currentTarget.dataset.index)
    DOM.moreInfoModal.close()
}

document.querySelector(".update-button").onclick = event => {
    DOM.updateInvestmentModal.open(event.currentTarget.dataset.index)
}

document.querySelector(".invest-button").onclick = event => {
    DOM.investModal.open(event.currentTarget.dataset.index)
}

document.querySelector(".toggle-redeem-button").onclick = event => {
    InvestmentsFunctions.toggleRedeem(event.currentTarget.dataset.index)
    App.reload()
}

App.init()