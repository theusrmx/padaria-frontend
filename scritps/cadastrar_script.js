document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const username = document.getElementById('username').value;
        const senha = document.getElementById('senha').value;
        const permissao = document.getElementById('permissao').value;

        const usuario = {
            name: nome,
            username: username,
            password: senha,
            role: permissao
        };

        fetch('http://localhost:8080/auth/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        })
        .then(response => response)
        .then(data => {
            console.log(data);
            alert("Usuário cadastrado com sucesso!");
        })
        .catch(error => {
            console.error('Erro ao cadastrar usuário:', error);
            alert("Erro ao cadastrar usuário");
        });
    });
});
