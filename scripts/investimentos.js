import Storage from "./storage.js";
import Utils from "./utils.js"
import InvestmentsFunctions from "./investmentsFunctions.js";

const App = {
    init: () => {
        DOM.setTable(Storage.get().investments, "simple")
    },
    reload: () => {
        DOM.setTable(Storage.get().investments, "simple")
        DOM.newInvestmentModal.close()
        DOM.newInvestmentModal.clearFields()
    }
}

const DOM = {
    setTable: (investments, detailType) => {
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

        document.querySelector("#investmentsSection table tbody").innerHTML = investments.map(investment => {
            return detailType === "simple" ? `
                <tr>
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
                <tr>
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
                    date: inputs[2].value,
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
    }
}

document.querySelector("#status-select").onchange = event => {
    const status = event.currentTarget.value
    const detailType = document.querySelector("#detail-select").value

    const investments = status === "ativo" || status === "resgatado"
        ?
        Storage.get().investments.filter(investment =>
            investment.status === status
        )
        :
        Storage.get().investments

    DOM.setTable(investments, detailType)
}

document.querySelector("#detail-select").onchange = event => {
    const detailType = event.currentTarget.value
    const status = document.querySelector("#status-select").value

    const investments = status === "ativo" || status === "resgatado"
        ?
        Storage.get().investments.filter(investment =>
            investment.status === status
        )
        :
        Storage.get().investments

    DOM.setTable(investments, detailType)
}

// open new investment modal
document.querySelector(".add-button").onclick = () => DOM.newInvestmentModal.open()

// close modals when click close button or press ESC key
window.onkeyup = e => {
    if (e.key === "Escape") {
        DOM.newInvestmentModal.close()
    }
}

document.querySelectorAll(".close-modal-button").forEach(button => {
    button.onclick = () => {
        DOM.newInvestmentModal.close()
    }
})

App.init()



// colocar os cards com o filtro de simples e detalhado

// colocar o titulo equivalente ao filtro de status
// Todos investimentos, Investmentos resgatados, investimentos ativos

// Criar as opções para atualizar o investimento
