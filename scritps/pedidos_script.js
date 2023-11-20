document.addEventListener('DOMContentLoaded', function () {
    // Fazendo fetch dos dados da API
    fetch('http://localhost:8080/pedidos/all')
      .then(response => response.json())
      .then(data => {
        const pedidosContainer = document.getElementById('pedidosContainer');

        // Organizando os pedidos por data da mais recente para a mais antiga
        const pedidosPorData = {};
        data.forEach(pedido => {
          const dataFormatada = new Date(pedido.pedido.dataPedido);
          if (!pedidosPorData[dataFormatada]) {
            pedidosPorData[dataFormatada] = [];
          }
          pedidosPorData[dataFormatada].push(pedido);
        });

        // Ordenando as datas da mais recente para a mais antiga
        const datasOrdenadas = Object.keys(pedidosPorData).sort((a, b) => new Date(b) - new Date(a));

        // Iterando sobre as datas ordenadas
        datasOrdenadas.forEach((data, index) => {
          const pedidos = pedidosPorData[data];

          // Criando divisão por data
          const divisaoHTML = `
            <div class="mt-3">
              <h3>${new Date(pedidos[0].pedido.dataPedido).toLocaleDateString()}</h3>
              <div class="card-deck">
                ${pedidos.map(pedido => `
                  <div class="card mb-3">
                    <div class="card-body">
                      <h5 class="card-title">Pedido ${pedido.pedido.idPedido}</h5>
                      <p class="card-text">Nome do Cliente: ${pedido.pedido.nomeCliente}</p>
                      <p class="card-text">Status do Pedido: ${pedido.pedido.statusPedido}</p>
                      <button class="btn btn-primary" onclick="mostrarDetalhesPedido(${pedido.pedido.idPedido})">Detalhes</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;

          pedidosContainer.innerHTML += divisaoHTML;
        });
      })
      .catch(error => console.error('Erro ao buscar dados:', error));
  });


  function mostrarDetalhesPedido(idPedido) {
    // Fazer fetch dos detalhes do pedido pelo ID
    fetch(`http://localhost:8080/pedidos/${idPedido}`)
      .then(response => response.json())
      .then(data => {
        // Criar o HTML com os detalhes do pedido
        const detalhesHTML = `
          <h4>Detalhes do Pedido ${data.pedido.idPedido}</h4>
          <ul>
            <li><strong>Data do Pedido:</strong> ${new Date(data.pedido.dataPedido).toLocaleDateString()}</li>
            <li><strong>Nome do Cliente:</strong> ${data.pedido.nomeCliente}</li>
            <li><strong>Endereço do Cliente:</strong> ${data.pedido.enderecoCliente}</li>
            <li><strong>Telefone do Cliente:</strong> ${data.pedido.telefoneCliente}</li>
            <div class="form-group">
            <li><label for="statusPedido"><strong>Status do Pedido: ${data.pedido.statusPedido}</strong></label>
            <select class="form-control" id="statusPedido">
                <option selected disabled>Editar status do pedido</option>
                <option value="PENDENTE">PENDENTE</option>
                <option value="EM PREPARO">EM PREPARO</option>
                <option value="SAIU PARA ENTREGA">SAIU PARA ENTREGA</option>
                <option value="ENTREGUE">ENTREGUE</option>
            </select>
            <button class="btn btn-success mt-2" onclick="salvarStatusPedido(${data.pedido.idPedido})">Salvar Status</button>
            </div></li>
            <li><strong>Total do Pedido:</strong> ${data.pedido.totalPedido.toFixed(2)}</li>
          </ul>
  
          <h4>Itens do Pedido</h4>
          <ul>
            ${data.itensPedido.map(item => `
              <li>
                <strong>ID do Item:</strong> ${item.idItem}<br>
                <strong>Produto:</strong> ${item.produtos.nomeProduto}<br>
                <strong>Quantidade:</strong> ${item.quantidade}<br>
                <strong>Preço Unitário:</strong> ${item.precoUnitario.toFixed(2)}<br>
                <strong>Observação:</strong> ${item.observacao}<br>
                <strong>Tamanho:</strong> ${item.tamanho}<br>
                <strong>Total do Item:</strong> ${item.totalItem.toFixed(2)}
              </li>
            `).join('')}
          </ul>
        `;
  
        detalhesPedidoModalBody.innerHTML = detalhesHTML;
  
        // Mostrar o modal
        $('#detalhesPedidoModal').modal('show');
      })
      .catch(error => console.error('Erro ao buscar detalhes do pedido:', error));
  }
  
  function salvarStatusPedido(idPedido) {
    // Obter o elemento do dropdown
    const statusPedidoDropdown = document.getElementById('statusPedido');

    // Obter o valor selecionado
    const novoStatus = statusPedidoDropdown.value;

    // Chamar a função para editar o status do pedido
    editarStatusPedido(idPedido, novoStatus);
}

function editarStatusPedido(idPedido, statusPedido) {
    // Fazendo o fetch para editar o status do pedido
    fetch(`http://localhost:8080/pedidos/editar-status/${idPedido}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: statusPedido, // Envie a string diretamente aqui
    })
    .then(response => {
        if (response.ok) {
            alert('Status do Pedido Atualizado com Sucesso!');
            location.reload(); // Recarregar a janela
        } else {
            alert('Erro ao Atualizar o Status do Pedido:', response.status);
        }
    })
    .catch(error => console.error('Erro ao Atualizar o Status do Pedido:', error));
}