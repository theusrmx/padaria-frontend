async function fazerLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        console.error('Erro ao fazer login');
        return;
    }

    const token = await response.text();
    console.log('Token:', token);
    // Armazenar o token (por exemplo, em localStorage)
    localStorage.setItem('token', token);
    acessarPagInicial(token);
    getName(token);
    getRole(token);
}

async function acessarPagInicial(token) {
    if (!token) {
        console.error('O usuário não está autenticado.');
        return;
    }

    const response = await fetch('http://localhost:8080/auth/redirect', {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
    });

    if (!response.ok) {
        console.error('Erro ao acessar recurso protegido');
        return;
    }

    const resposta = await response.text();

    if (resposta.startsWith('redirect:')) {
        const urlRedirecionamento = resposta.substring(9); // Remova "redirect:" do início da string
        window.location.href = urlRedirecionamento;
    } else {
        console.error('Erro');
    }
}

// Função para obter o nome do usuário do servidor
async function getName(token) {
    try {

        // Verificar se o token está presente
        if (!token) {
            console.error('O usuário não está autenticado.');
            return;
        }

        const response = await fetch('http://localhost:8080/auth/get-name', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        });

        if (!response.ok) {
            console.error('Erro ao obter o nome do usuário');
            return;
        }

        const name = await response.text();
        console.log('Nome do usuário:', name);

        // Armazenar o nome no localStorage
        localStorage.setItem('name', name);
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

// Função para obter a role do usuario
async function getRole(token) {
    try {

        // Verificar se o token está presente
        if (!token) {
            console.error('O usuário não está autenticado.');
            return;
        }

        const response = await fetch('http://localhost:8080/auth/get-role', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        });

        if (!response.ok) {
            console.error('Erro ao obter a role do usuário');
            return;
        }

        const role = await response.text();
        console.log('Role do usuário:', role);

        // Armazenar o nome no localStorage
        localStorage.setItem('role', role);
    } catch (error) {
        console.error('Erro:', error.message);
    }
}