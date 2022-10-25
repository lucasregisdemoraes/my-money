import Storage from "./storage.js";
import Utils from "./utils.js"
import InvestmentsFunctions from "./investmentsFunctions.js";

const App = {
    init: () => {
        DOM.setTable(Storage.get().investments, "simple")
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
                    <td class="table-more-info-button">
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
                    <td class="table-more-info-button">
                        <abbr title="Opções">
                            <div></div><div></div><div></div>
                        </abbr>
                    </td>
                </tr>
            `
        }).join("")
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

App.init()