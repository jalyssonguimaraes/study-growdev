const myModal = new bootstrap.Modal("#transactionModal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

let data = {
    transactions: []
};

document.addEventListener("DOMContentLoaded", function() {
   
    // Verifica se o usuário está logado
    
    if (!logged && session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (!logged) {
        window.location.href = "index.html";
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    getCashIn();
    getCashOut();
    getTotal();

    document.getElementById("button-logout").addEventListener("click", logout);

    // Insere os Dados do Form
    document.getElementById("transaction-form").addEventListener("submit", function(e) {
        e.preventDefault();

        const value = parseFloat(document.getElementById("value-input").value);
        const description = document.getElementById("description-input").value;
        const date = document.getElementById("date-input").value;
        const type = document.querySelector('input[name="inlineRadioOptions"]:checked').value;

        // Verifica se a transação deixará o saldo total negativo
        let newTotal = calculateNewTotal(value, type);
        if (newTotal < 0) {
            const confirmacao = confirm("Atenção. Seu saldo após cadastrar essa despesa será negativo, deseja continuar?");
            if (!confirmacao) {
                return; // Cancela o cadastro da transação
            }
        }

        // Registra a transação
        data.transactions.unshift({
            value: value,
            type: type,
            description: description,
            date: date
        });

        saveData(data);
        e.target.reset();
        myModal.hide();

        getCashIn();
        getCashOut();
        getTotal();

        alert("Lançamento Criado com Sucesso.");
    });
});

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
}

function getCashIn() {
    const transactions = data.transactions;
    const cashIn = transactions.filter(item => item.type === "1");

    if (cashIn.length) {
        let cashInHtml = ``;
        let limit = cashIn.length > 5 ? 5 : cashIn.length;

        for (let index = 0; index < limit; index++) {
            cashInHtml += `
                <div class="row mb-4">
                    <div class="col-12">
                        <h3> R$ ${cashIn[index].value.toFixed(2)}</h3>
                        <div class="container p-0">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <p>${cashIn[index].description}</p>
                                </div>
                                <div class="col-12 col-md-3 d-flex justify-content-end">
                                    ${cashIn[index].date}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        }

        document.getElementById("cash-in-list").innerHTML = cashInHtml;
    }
}

function getCashOut() {
    const transactions = data.transactions;
    const cashout = transactions.filter(item => item.type === "2");

    if (cashout.length) {
        let cashOutHtml = ``;
        let limit = cashout.length > 5 ? 5 : cashout.length;

        for (let index = 0; index < limit; index++) {
            cashOutHtml += `
                <div class="row mb-4">
                    <div class="col-12">
                        <h3> R$ ${cashout[index].value.toFixed(2)}</h3>
                        <div class="container p-0">
                            <div class="row">
                                <div class="col-12 col-md-8">
                                    <p>${cashout[index].description}</p>
                                </div>
                                <div class="col-12 col-md-3 d-flex justify-content-end">
                                    ${cashout[index].date}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        }

        document.getElementById("cash-out-list").innerHTML = cashOutHtml;
    }
}

function getTotal() {
    const transactions = data.transactions;
    let total = 0;
    transactions.forEach(item => {
        if (item.type === "1") {
            total += item.value;
        } else {
            total -= item.value;
        }
    });
    document.getElementById("Total").innerHTML = `R$ ${total.toFixed(2)}`;
}

function saveData(data) {
    localStorage.setItem(logged, JSON.stringify(data));
}

function calculateNewTotal(transactionValue, transactionType) {
    const transactions = data.transactions;
    let total = 0;
    transactions.forEach(item => {
        if (item.type === "1") {
            total += item.value;
        } else {
            total -= item.value;
        }
    });

    if (transactionType === "1") {
        total += transactionValue;
    } else {
        total -= transactionValue;
    }

    return total;
}
