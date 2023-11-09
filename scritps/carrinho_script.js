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

/*
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
}); */
/*
function enviarPedido(){
    var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    console.log(carrinho)

    var dataAtual = new Date().toISOString();

    var pedido = {
        dataPedido: dataAtual, 
        nomeCliente: document.getElementById('clienteInput').value,
        enderecoCliente: document.getElementById('enderecoInput').value,
        telefoneCliente: document.getElementById('telInput').value,
        statusPedido: "Em andamento", // Status padrão
        totalPedido: totalPedido 
      };

      console.log(pedido)
      
      // URL do endpoint para cadastrar o pedido no backend
      var url = baseUrl + 'pedidos/criar';
      
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
          alert("Pedido registrado com sucesso");
          // Realize ações adicionais, como redirecionar o usuário ou exibir uma mensagem de confirmação
        })
        .catch(error => {
          console.error('Erro ao cadastrar o pedido:', error);
          alert('Erro ao registrar o pedido.');
          // Lide com o erro de alguma forma, como exibindo uma mensagem de erro
        });   
}
*/

// Função para gerar um ID temporário
function generateTemporaryId() {
  return 'temp_' + Math.random().toString(36).substr(2, 9); // Geração simples para exemplo
}

// Método para criar o pedido
function criarPedido() {
  var dataAtual = new Date().toISOString();

  var pedido = {
    dataPedido: dataAtual,
    nomeCliente: document.getElementById('clienteInput').value,
    enderecoCliente: document.getElementById('enderecoInput').value,
    telefoneCliente: document.getElementById('telInput').value,
    statusPedido: "Em andamento", // Status padrão
    totalPedido: totalPedido,
    idTemporario: generateTemporaryId(), // Gere um ID temporário no frontend
  };

  // Adicione o pedido ao localStorage para referência futura
  var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.push(pedido);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  return pedido.idTemporario; // Retorne o ID temporário
}

// Função para enviar os itens do pedido
function enviarItensDoPedido(pedidoIdTemporario) {
  var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  carrinho.forEach(itemCarrinho => {
    var itemPedido = {
      pedido: pedidoIdTemporario,
      produtos: itemCarrinho.idItem,
      quantidade: itemCarrinho.quantidade,
      precoUnitario: itemCarrinho.preco,
      observacao: "", // Adicione observação, se necessário
      totalItem: itemCarrinho.preco * itemCarrinho.quantidade,
    };

    console.log(itemPedido)

    // URL do endpoint para cadastrar o ItemPedido no backend
    var itemPedidoUrl = baseUrl + 'itemPedido/criar'; // Substitua pelo URL correto

    // Configuração da requisição para criar o ItemPedido
    var itemPedidoRequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemPedido),
    };

    // Realize a requisição para criar o ItemPedido
    fetch(itemPedidoUrl, itemPedidoRequestOptions)
      .then(response => response.json())
      .then(itemPedidoData => {
        console.log('ItemPedido cadastrado com sucesso:', itemPedidoData);
        // Realize ações adicionais, se necessário
      })
      .catch(error => {
        console.error('Erro ao cadastrar o ItemPedido:', error);
        // Lide com o erro de alguma forma
      });
  });

  // Limpe o localStorage após o envio bem-sucedido de todos os itens
  localStorage.removeItem('carrinho');
}

// Função principal que chama ambos os métodos
function enviarPedido() {
  var pedidoIdTemporario = criarPedido();

  // Continue com o envio dos itens do pedido utilizando o ID temporário
  enviarItensDoPedido(pedidoIdTemporario);
}

