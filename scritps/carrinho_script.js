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

function enviarPedido() {
  var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  console.log('Carrinho:', carrinho);

  var dataAtual = new Date().toISOString(); // Corrigido para adicionar parênteses
  var totalPedido = calcularTotalPedido(carrinho);
  var idPedidoPersonalizado = gerarIdPedido();

  console.log("ID do Pedido: " + idPedidoPersonalizado);

  var pedido = {
    idPedido: idPedidoPersonalizado,
    dataPedido: dataAtual,
    nomeCliente: document.getElementById('clienteInput').value,
    enderecoCliente: document.getElementById('enderecoInput').value,
    telefoneCliente: document.getElementById('telInput').value,
    statusPedido: "Em andamento",
    totalPedido: totalPedido
  };

  console.log('Pedido:', pedido);

  // Certifique-se de que baseUrl esteja definida adequadamente
  var urlPedido = baseUrl + 'pedidos/criar';

  var requestOptionsPedido = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pedido)
  };

  // Cadastro do Pedido
  fetch(urlPedido, requestOptionsPedido)
    .then(response => response.json())
    .then(data => {
      console.log('Pedido cadastrado com sucesso:', data);
      alert('Pedido registrado com sucesso.');
      
      // Cadastro dos Itens do Pedido
      carrinho.forEach(itemCarrinho => {
        var itemPedido = {
          pedido: idPedidoPersonalizado,
          produtos: itemCarrinho.idItem,
          quantidade: itemCarrinho.quantidade,
          tamanho: itemCarrinho.tamanho,
          precoUnitario: itemCarrinho.preco || 0, // Defina um valor padrão se for nulo ou indefinido
          observacao: "", // Adicione observação, se necessário
          totalItem: itemCarrinho.preco * itemCarrinho.quantidade,
        };
        
        console.log('Item do Carrinho:', itemCarrinho);
        console.log('Item do Pedido:', itemPedido);

        // Certifique-se de que baseUrl esteja definida adequadamente
        var urlItemPedido = baseUrl + 'itemPedido/criar';

        var requestOptionsItem = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemPedido),
        };

        // Cadastro do Item do Pedido
        fetch(urlItemPedido, requestOptionsItem)
          .then(response => response.json())
          .then(dataItem => {
            console.log('Item do pedido cadastrado com sucesso:', dataItem);
          })
          .catch(error => {
            console.error('Erro ao cadastrar o ItemPedido:', error);
            // Lide com o erro de alguma forma
          });
      });
    })
    .catch(error => {
      console.error('Erro ao cadastrar o pedido:', error);
      alert('Erro ao registrar o pedido, tente novamente.');
    });
}


// Função para calcular o total do pedido com base no carrinho
function calcularTotalPedido(carrinho) {
  // Lógica para calcular o total do pedido a partir do carrinho
  // Substitua isso com sua própria lógica de cálculo
  return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
}

function gerarIdPedido() {
  var dataFormatada = formatDateToString(new Date());
  var numeroPedido = gerarNumeroPedido();
  return dataFormatada + "-" + numeroPedido;
}

function formatDateToString(date) {
  var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('en-US', options).format(date).replace(/\//g, '').replace(/,/g, '').replace(/ /g, '').replace(/:/g, '');
}

function gerarNumeroPedido() {
  // Lógica para gerar o número de pedido, por exemplo, a partir de um contador
  // Aqui pode ser uma lógica específica do cliente ou obtida do servidor
  return Math.floor(Math.random() * 1000) + 1;
}



