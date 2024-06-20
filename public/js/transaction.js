const myModal = new bootstrap.Modal(document.getElementById("transactionModal"));

let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

let data = {
    transactions: []
};

function saveData(data) {
    localStorage.setItem(logged, JSON.stringify(data));
}

function getCashIn() {

}

function getCashOut() {

}

function getTotal() {
  
}

document.getElementById("button-logout").addEventListener("click", logout);

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
}

document.getElementById("transaction-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="inlineRadioOptions"]:checked').value;


    let newTotal = calculateNewTotal(value, type);
    if (newTotal < 0) {
        const confirmacao = confirm("Atenção. Seu saldo após cadastrar essa despesa será negativo, deseja continuar?");
        if (!confirmacao) {
            return; 
        }
    }


    data.transactions.unshift({
        value: value,
        type: type,
        description: description,
        date: date
    });

    saveData(data);
    e.target.reset();
    myModal.hide();

    updateTransactionTable();

    alert("Lançamento Criado com Sucesso.");
});

function updateTransactionTable() {
    const tbody = document.getElementById("transaction-table-body");
    tbody.innerHTML = "";

    data.transactions.forEach(transaction => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.value}</td>
            <td>${transaction.type === '1' ? 'Entrada' : 'Saída'}</td>
            <td>${transaction.description}</td>
        `;
        tbody.appendChild(row);
    });

    getTotal(); 
}

if (!logged && session) {
    sessionStorage.setItem("logged", session);
    logged = session;
}

if (!logged) {
    window.location.href = "index.html";
}

const dataUser = localStorage.getItem(logged);
if (dataUser) {
    data = JSON.parse(dataUser);
}

updateTransactionTable();

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
