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
        DOM.newInvestmentModal.close()
        DOM.newInvestmentModal.clearFields()
        DOM.moreInfoModal.close()

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
                        <abbr title="Opções">
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
    newInvestmentModal: {
        open: () => {
            document.querySelector(".new-investment-modal").classList.add("active")

            document.querySelector(".new-investment-modal form").onsubmit = event => {
                event.preventDefault()

                const inputs = [...document.querySelectorAll(".new-investment-modal form input")]

                const investment = {
                    name: inputs[0].value,
                    value: inputs[1].value,
                    date: Utils.convertDateFormat(inputs[2].value, "-", "/"),
                }

                try {
                    DOM.validateFields({
                        functionToDo: InvestmentsFunctions.new,
                        functionParameter: investment
                    })
                } catch (error) {
                    alert(error.message)
                }
            }
        },
        close: () => {
            document.querySelector(".new-investment-modal")
                .classList.remove("active")
        },
        clearFields: () => {
            document.querySelectorAll(".new-investment-modal form input")
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

            document.querySelector(".more-info-modal").dataset.index = index

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
    }
}

document.querySelector("#status-select").onchange = () => App.reload()

document.querySelector("#detail-select").onchange = () => App.reload()

// open new investment modal
document.querySelector(".add-button").onclick = () => DOM.newInvestmentModal.open()

// close modals when click close button or press ESC key
window.onkeyup = e => {
    if (e.key === "Escape") {
        DOM.newInvestmentModal.close()
        DOM.moreInfoModal.close()
    }
}

document.querySelectorAll(".close-modal-button").forEach(button => {
    button.onclick = () => {
        DOM.newInvestmentModal.close()
        DOM.moreInfoModal.close()
    }
})

document.querySelector(".delete-button")
    .onclick = event => DOM.confirmationModal.open({
        functionToDo: InvestmentsFunctions.remove,
        functionParameters: event.currentTarget.parentElement.parentElement.dataset.index,
        message: `Deseja deletar o investimento?`
    })

App.init()