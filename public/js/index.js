document.addEventListener("DOMContentLoaded", function() {
    const mymodal = new bootstrap.Modal("#registerModal");
    let logged = sessionStorage.getItem("logged");
    const session = localStorage.getItem("session");

    checkLogged();

    // lOGIN
    document.getElementById("login-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("login-input-email").value;
        const password = document.getElementById("login-input-Password").value;
        const rememberMe = document.getElementById("session-check").checked;

        const account = getAccount(email);

        if (!account) {
            alert("Ops! Verifique o usuário ou a senha.");
            return;
        }

        if (account.password !== password) {
            alert("Ops! Verifique o usuário ou a senha.");
            return;
        }

        saveSession(email, rememberMe);
        window.location.href = "home.html";
    });

    // CADASTRO DE USUÁRIO
    document.getElementById("create-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email-create-imput").value;
        const password = document.getElementById("password-create-imput").value;
        const confirmPassword = document.getElementById("confirm-create-imput").value;

        if (email.length < 5) {
            alert("Preencha o campo com um email válido");
            return;
        }
        if (password.length < 5) {
            alert("Preencha a senha com no mínimo 6 dígitos");
            return;
        }
        if (confirmPassword !== password) {
            alert("As senhas não conferem");
            return;
        }
        


        saveAccount({
            email: email,
            password: password,
            transactions: []
        });

        mymodal.hide();
        alert("Conta Criada com Sucesso!");
    });

    function checkLogged() {
        if (session) {
            sessionStorage.setItem("logged", session);
            window.location.href = "home.html";
        }
    }

    function saveAccount(data) {
        localStorage.setItem(data.email, JSON.stringify(data));
    }

    function saveSession(email, rememberMe) {
        if (rememberMe) {
            localStorage.setItem("session", email);
        }
        sessionStorage.setItem("logged", email);
    }

    function getAccount(email) {
        const accountStr = localStorage.getItem(email);
        return accountStr ? JSON.parse(accountStr) : null;
    }
});
