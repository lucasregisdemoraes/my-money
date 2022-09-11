export default {
    formatValueToCurrency: value => value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),

    // ======== OU ========

    // formatValueToCurrency: value => {
    //     return value.toLocaleString('pt-br',
    //         {
    //             style: 'currency',
    //             currency: 'BRL'
    //         })
    //     },

    getMonthsFromTransactions: transactions => {
        let months = []
        transactions.forEach((transaction) => {
            if (!months.includes(transaction.date.substring(3))) {
                months.push(transaction.date.substring(3))
            }
        })

        return months
    },
    convertMonthFormat: (month) => {
        month = month.split("-")
        month = `${month[2]}/${month[1]}/${month[0]}`
        return month
    },
    formatDateToMonthName: date => {
        let monthNumber = date.substring(0, 2)
        switch (monthNumber) {
            case "01":
                return "janeiro";
            case "02":
                return "Fevereiro";
            case "03":
                return "Março";
            case "04":
                return "Abril";
            case "05":
                return "Maio";
            case "06":
                return "Junho";
            case "07":
                return "Julho";
            case "08":
                return "Agosto";
            case "09":
                return "Setembro";
            case "10":
                return "Outubro";
            case "11":
                return "Novembro";
            case "12":
                return "Dezembro";
            default:
                break;
        }
    }

}