var baseUrl = 'http://localhost:8080/'; 
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
    observacaoCell.innerHTML = `<input type='text' placeholder='Observação' id='observacao-${index}' value='${item.observacao || ""}'>`;
    
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


// Função para calcular o total do pedido com base no carrinho
function calcularTotalPedido(carrinho) {
  // Lógica para calcular o total do pedido a partir do carrinho
  // Substitua isso com sua própria lógica de cálculo
  return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
}

function gerarIdPedido() {
  var dataAtual = new Date();
  var dataFormatada = dataAtual.toISOString().split('T')[0];
  var numeroPedido = gerarNumeroPedido();
  return dataFormatada + "-" + numeroPedido;
}

function gerarNumeroPedido() {
  // Lógica para gerar o número de pedido, por exemplo, a partir de um contador
  // Aqui pode ser uma lógica específica do cliente ou obtida do servidor
  return Math.floor(Math.random() * 1000) + 1;
}

function limparCarrinho() {
  // Limpar o carrinho no localStorage
  localStorage.removeItem('carrinho');
  // Recarregar a página para atualizar a tabela ou realizar outras ações necessárias
  location.reload();
}



async function enviarPedido() {
  try {
    var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    var dataAtual = new Date().toISOString();
    var totalPedido = calcularTotalPedido(carrinho);
    var idPedidoPersonalizado = gerarIdPedido();

    console.log("ID do Pedido: " + idPedidoPersonalizado);

    var pedido = {
      dataPedido: dataAtual,
      nomeCliente: document.getElementById('clienteInput').value,
      enderecoCliente: document.getElementById('enderecoInput').value,
      telefoneCliente: document.getElementById('telInput').value,
      statusPedido: "PENDENTE",
      totalPedido: totalPedido
    };

    var itensPedido = carrinho.map(function (itemCarrinho, index) {
      return {
          idItem: itemCarrinho.idItem,
          quantidade: itemCarrinho.quantidade,
          precoUnitario: itemCarrinho.preco || 0,
          observacao: document.getElementById(`observacao-${index}`).value || "Nenhuma observação.",
          tamanho: itemCarrinho.tamanho || "",
          totalItem: itemCarrinho.preco * itemCarrinho.quantidade || 0,
          produtos: itemCarrinho.idItem || 0
      };
    });
  

    var dadosPedido = {
      pedido: pedido,
      itensPedido: itensPedido
    };

    console.log('Dados do Pedido:', dadosPedido);

    var urlPedido = baseUrl + 'pedidos/checkout';

    var requestOptionsPedido = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json' // Adicione os headers necessários
      },
      body: JSON.stringify(dadosPedido)
    };

    const response = await fetch(urlPedido, requestOptionsPedido);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Erro ao cadastrar o pedido: ' + (data.error || response.statusText));
    }

    console.log('Pedido cadastrado com sucesso:', data);
    alert('Pedido registrado com sucesso.');
    
    // Limpar o carrinho após o sucesso do pedido
    limparCarrinho();
  } catch (error) {
    console.error(error);
    alert('Erro ao registrar o pedido, tente novamente.');
  }
}

document.getElementById('pedidoForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Adicione aqui sua lógica de validação antes de enviar o pedido
  var clienteInput = document.getElementById('clienteInput').value;
  var enderecoInput = document.getElementById('enderecoInput').value;
  var telInput = document.getElementById('telInput').value;

  if (clienteInput.trim() === '' || enderecoInput.trim() === '' || telInput.trim() === '') {
      alert('Por favor, preencha todos os campos.');
  } else if (carrinho.length === 0) {
      alert('O carrinho está vazio. Adicione itens ao carrinho antes de enviar o pedido.');
  } else {
      // Se os campos estiverem preenchidos e o carrinho não estiver vazio,
      // você pode chamar sua função enviarPedido()
      enviarPedido();
  }
});