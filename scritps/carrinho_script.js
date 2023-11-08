//URL BASE PARA API
const baseUrl = 'http://localhost:8080/'

// Recupere os itens do carrinho do localStorage
var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
console.log(carrinho)

// Seletor para a tabela de itens do carrinho
var carrinhoTbody = document.querySelector("tbody");
var totalPedidoElement = document.getElementById("total-pedido");
var totalPedido = 0;

// Preencha a tabela de itens do carrinho
carrinho.forEach(function (item, index) {
    var newRow = carrinhoTbody.insertRow();
    var produtoCell = newRow.insertCell(0);
    var tamanhoCell = newRow.insertCell(1);
    var precoUnitarioCell = newRow.insertCell(2);
    var quantidadeCell = newRow.insertCell(3);
    var observacaoCell = newRow.insertCell(4);
    var totalCell = newRow.insertCell(5);
    var excluirCell = newRow.insertCell(6); // Coluna para o botão de excluir

    produtoCell.innerHTML = item.nome;
    tamanhoCell.innerHTML = item.tamanho;
    precoUnitarioCell.innerHTML = "R$ " + item.preco.toFixed(2);
    quantidadeCell.innerHTML = item.quantidade;
    observacaoCell.innerHTML = "<input type='text' placeholder='Observação' id='observacao-" + index + "'>"; // Campo de observação
    
    totalCell.innerHTML = "R$ " + item.precoTotal.toFixed(2);

    // Botão de excluir
    var excluirButton = document.createElement("button");
    excluirButton.textContent = "Excluir";
    excluirButton.className = "btn btn-danger";
    excluirButton.addEventListener("click", function () {
        // Chamada da função para excluir o item do carrinho
        excluirItemDoCarrinho(index);
    });

    excluirCell.appendChild(excluirButton);

    totalPedido += item.precoTotal;
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
    console.log(carrinho)
    
    var dataHora = new Date(); // Data e hora atual

    var options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
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
    fetch(baseUrl + 'carrinho/checkout', {
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
            alert('Erro ao fechar o pedido.')
        }
    })
    .catch(error => {
        console.error('Erro ao enviar o pedido para o backend:', error);
    });
}

document.querySelector('#pedidoForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que o formulário seja submetido de forma padrão
    enviarPedidoParaBackend();
});


function enviarPedido(){
    var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    console.log(carrinho)

    var pedido = {
        dataPedido: new Date(), // Use a data atual
        nomeCliente: document.getElementById('clienteInput').value,
        enderecoCliente: document.getElementById('enderecoInput').value,
        telefoneCliente: document.getElementById('telInput').value,
        statusPedido: "Em andamento", // Status padrão
        totalPedido: totalPedido // Certifique-se de definir o totalPedido corretamente
      };

      console.log(pedido)
      /*
      // URL do endpoint para cadastrar o pedido no backend
      var url = baseUrl + '/pedidos/criar';
      
      // Configuração da requisição
      var requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
      };
      
      // Realize a requisição
      fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log('Pedido cadastrado com sucesso:', data);
          // Realize ações adicionais, como redirecionar o usuário ou exibir uma mensagem de confirmação
        })
        .catch(error => {
          console.error('Erro ao cadastrar o pedido:', error);
          // Lide com o erro de alguma forma, como exibindo uma mensagem de erro
        });
        */

}

window.onload = enviarPedido
