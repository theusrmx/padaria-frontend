window.onload = async function () {
    const token = localStorage.getItem('token');

    // Elementos HTML
    const usuarioAutenticado = document.getElementById('usuario-autenticado');
    const nomeUsuario = document.getElementById('nome-usuario');
    const botaoLogout = document.getElementById('botao-logout');

    // Verificar se o usuário está autenticado
    if (token) {
        // Exibir elementos para usuário autenticado
        usuarioAutenticado.style.display = 'block';

        // Obter informações do usuário (por exemplo, nome) usando o token
        const username = localStorage.getItem('name');
        nomeUsuario.textContent = username;

        // Adicionar evento de logout
        botaoLogout.addEventListener('click', () => {
            // Implemente a lógica de logout, por exemplo, limpe o token no localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            localStorage.removeItem('role');

            // Redirecione para a página de login ou outra página apropriada
            window.location.href = 'index.html';
        });
    } else if (!token) {
        // Redirecionar apenas se a página atual não for já a página padrão não autenticada
        if (window.location.pathname !== '/index.html') {
            window.location.href = '/index.html';
        }
        return;
    }

    // Verificar o papel do usuário em cada requisição
    await verificarPapel(token);
};

async function verificarPapel(token) {
    try {
        const response = await fetch('http://localhost:8080/auth/redirect', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao verificar papel do usuário');
        }

        const resposta = await response.text();

        if (resposta.startsWith('redirect:')) {
            const urlRedirecionamento = resposta.substring(9); // Remover "redirect:" do início da string

            // Verificando se a página já é a que está tentando redirecionar
            if (window.location.pathname !== `/${urlRedirecionamento}`) {
                window.location.href = `/${urlRedirecionamento}`;
            }
        }
    } catch (error) {
        console.error(error.message);
    }
}

console.log(localStorage.getItem('role'));
