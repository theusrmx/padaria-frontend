document.addEventListener('DOMContentLoaded', function () {
    // Fazendo fetch dos dados da API
    fetch('http://localhost:8080/pedidos/all')
      .then(response => response.json())
      .then(data => {
        // Organizando os pedidos por data da mais recente para a mais antiga
        const pedidosPorData = {};
        data.forEach(pedido => {
          const dataFormatada = new Date(pedido.pedido.dataPedido).toLocaleDateString();
          if (!pedidosPorData[dataFormatada]) {
            pedidosPorData[dataFormatada] = [];
          }
          pedidosPorData[dataFormatada].push(pedido);
        });
  
        const accordionPedidos = document.getElementById('accordionPedidos');
  
        // Ordenando as datas da mais recente para a mais antiga
        const datasOrdenadas = Object.keys(pedidosPorData).sort((a, b) => new Date(b) - new Date(a));
  
        // Iterando sobre as datas ordenadas
        datasOrdenadas.forEach((data, index) => {
          const pedidos = pedidosPorData[data];
  
          const itensPedidosHTML = pedidos.map((pedido, pedidoIndex) => {
            const itensPedidoHTML = pedido.itensPedido.map(item => `
              <li>
                <strong>ID do Item:</strong> ${item.idItem}<br>
                <strong>Produto:</strong> ${item.produtos.nomeProduto}<br>
                <strong>Quantidade:</strong> ${item.quantidade}<br>
                <strong>Preço Unitário:</strong> ${item.precoUnitario.toFixed(2)}<br>
                <strong>Observação:</strong> ${item.observacao}<br>
                <strong>Tamanho:</strong> ${item.tamanho}<br>
                <strong>Total do Item:</strong> ${item.totalItem.toFixed(2)}
              </li>
            `).join('');
  
            return `
              <div class="card">
                <div class="card-header" id="heading${index}-${pedidoIndex}">
                  <h2 class="mb-0">
                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${index}-${pedidoIndex}" aria-expanded="true" aria-controls="collapse${index}-${pedidoIndex}">
                      Pedido ${pedido.pedido.idPedido} - ${data}
                    </button>
                    <button class="btn btn-primary ml-2" onclick="editarPedido(${pedido.pedido.idPedido})">Editar</button>
                    <button class="btn btn-danger ml-2" onclick="excluirPedido(${pedido.pedido.idPedido})">Excluir</button>
                  </h2>
                </div>
  
                <div id="collapse${index}-${pedidoIndex}" class="collapse" aria-labelledby="heading${index}-${pedidoIndex}" data-parent="#accordionPedidos">
                  <div class="card-body">
                    <h4>Detalhes do Pedido ${pedido.pedido.idPedido}</h4>
                    <ul>
                      <li><strong>Data do Pedido:</strong> ${new Date(pedido.pedido.dataPedido).toLocaleDateString()}</li>
                      <li><strong>Nome do Cliente:</strong> ${pedido.pedido.nomeCliente}</li>
                      <li><strong>Endereço do Cliente:</strong> ${pedido.pedido.enderecoCliente}</li>
                      <li><strong>Telefone do Cliente:</strong> ${pedido.pedido.telefoneCliente}</li>
                      <li><strong>Status do Pedido:</strong> ${pedido.pedido.statusPedido}</li>
                      <li><strong>Total do Pedido:</strong> ${pedido.pedido.totalPedido.toFixed(2)}</li>
                    </ul>
                    
                    <h4>Itens do Pedido</h4>
                    <ul>${itensPedidoHTML}</ul>
                  </div>
                </div>
              </div>
            `;
          }).join('');
  
          accordionPedidos.innerHTML += itensPedidosHTML;
        });
      })
      .catch(error => console.error('Erro ao fazer fetch dos dados:', error));
  });
