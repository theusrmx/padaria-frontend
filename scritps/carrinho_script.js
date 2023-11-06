//URL BASE PARA API
const baseUrl = 'http://localhost:8080/'

// Recupere os itens do carrinho do localStorage
var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Seletor para a tabela de itens do carrinho
var carrinhoTbody = document.querySelector("tbody");
var totalPedidoElement = document.getElementById("total-pedido");
var totalPedido = 0;

// Preencha a tabela de itens do carrinho
carrinho.forEach(function (item, index) {
    var newRow = carrinhoTbody.insertRow();
    var produtoCell = newRow.insertCell(0);
    var precoUnitarioCell = newRow.insertCell(1);
    var observacaoCell = newRow.insertCell(2);
    var totalCell = newRow.insertCell(3);
    var excluirCell = newRow.insertCell(4); // Coluna para o botão de excluir

    produtoCell.innerHTML = item.nome;
    observacaoCell.innerHTML = "<input type='text' placeholder='Observação' id='observacao-" + index + "'>"; // Campo de observação
    precoUnitarioCell.innerHTML = "R$ " + item.preco.toFixed(2);
    totalCell.innerHTML = "R$ " + item.preco.toFixed(2);

    // Botão de excluir
    var excluirButton = document.createElement("button");
    excluirButton.textContent = "Excluir";
    excluirButton.className = "btn btn-danger";
    excluirButton.addEventListener("click", function () {
        // Chamada da função para excluir o item do carrinho
        excluirItemDoCarrinho(index);
    });

    excluirCell.appendChild(excluirButton);

    totalPedido += item.preco;
});

// Atualize o total do pedido
totalPedidoElement.textContent = "Total do Pedido: R$ " + totalPedido.toFixed(2);

// Função para excluir um item do carrinho
function excluirItemDoCarrinho(index) {
    carrinho.splice(index, 1); // Remove o item do carrinho
    localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza o carrinho no localStorage
    location.reload(); // Recarrega a página para atualizar a tabela
}

// Função para enviar o pedido para o backend
function enviarPedidoParaBackend() {
    var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    var dataHora = new Date().toISOString(); // Obtém a data e hora no formato UTC

    var dataHora = new Date(); // Data e hora atual

    var options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    var dataHoraFormatada = new Intl.DateTimeFormat('pt-BR', options).format(dataHora);
    
    // Construir o objeto do pedido
    var pedido = {
        dataHora: dataHoraFormatada,
        statusPedido: "Em andamento",
        nomeCliente: document.getElementById('clienteInput').value,
        enderecoCliente: document.getElementById('enderecoInput').value,
        telefoneCliente: document.getElementById('telInput').value,
        itensPedido: carrinho
    };

    console.log(pedido)

    // Enviar o pedido para o backend
    fetch('/carrinho/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    })
    .then(response => {
        if (response.ok) {
            // Pedido enviado com sucesso
            // Limpar o carrinho
            localStorage.removeItem('carrinho');
            // Atualizar a tabela do carrinho (se necessário)
            atualizarTabelaCarrinho();
            alert('Pedido realizado!')
        } else {
            // Lidar com erros, se houver
            console.error('Erro ao enviar o pedido para o backend.');
        }
    })
    .catch(error => {
        console.error('Erro ao enviar o pedido para o backend:', error);
    });
}


