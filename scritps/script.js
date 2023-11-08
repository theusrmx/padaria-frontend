 // Função para fazer a solicitação GET à sua API e preencher os cards
 function preencherCardsComDados() {
    const apiUrl = 'http://localhost:8080/produtos/cardapio-dia'; // Substitua pela URL real da sua API

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição.');
            }
            return response.json();
        })
        .then(dadosDaAPI => {
            const marmitasContainer = document.getElementById('marmitas-container');
            console.log('Dados da API:', dadosDaAPI);

            if(dadosDaAPI && Array.isArray(dadosDaAPI) && dadosDaAPI.length > 0){
                dadosDaAPI.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'col-md-4';
                    card.innerHTML = `
                    <div class="card mb-4">
                        <img src="${item.imagemProduto}" class="card-img-top imagem-card img-fluid" alt="${item.nomeProduto}">
                        <div class="card-body">
                            <h5 class="card-title">${item.nomeProduto}</h5>
                            <p class="card-text">Descrição do prato:</p>
                            <p class="card-text">${item.descricao}</p>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="tamanho" value="Média" data-preco="${item.precoMedio}">
                                <label class="form-check-label">
                                    Média - R$ ${item.precoMedio.toFixed(2)}
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="tamanho" value="Grande" data-preco="${item.precoGrande}">
                                <label class="form-check-label">
                                    Grande - R$ ${item.precoGrande.toFixed(2)}
                                </label>
                            </div>
                            <br>
                            <div class="counter">
                                <span class="down" onClick='decreaseCount(event, this)'>-</span>
                                <input type="text" value="1" class="qtd-item">
                                <span class="up" onClick='increaseCount(event, this)'>+</span>
                            </div>
                            <br>
                            <a href="javascript:void(0);" class="btn btn-primary" onclick="adicionarAoCarrinho('${item.idProduto}', getQuantidade(this), '${item.nomeProduto}')">
                            Adicionar ao Carrinho
                            </a>
                        </div>
                    </div>
                    `;
    
                    marmitasContainer.appendChild(card);
    
                    
                });
                
            }else{
                //Se a api estiver vazia (como por exemplo, final de semana), exibe mensagem de sem vendas
                const mensagemVazia = document.createElement('h4');
                mensagemVazia.textContent = "Desculpe, não estamos fazendo vendas hoje! Volte outro dia."
                marmitasContainer.appendChild(mensagemVazia);
            }
   
        })
        .catch(error => {
            console.error(error);
            //Se a api estiver vazia (como por exemplo, final de semana), exibe mensagem de sem vendas
            const marmitasContainer = document.getElementById('marmitas-container');
            const mensagemVazia = document.createElement('h4');
            mensagemVazia.textContent = "Desculpe, não estamos fazendo vendas hoje! Volte outro dia."
            marmitasContainer.appendChild(mensagemVazia);
        });
}

function increaseCount(a, b) {
    var input = b.previousElementSibling;
    var value = parseInt(input.value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    input.value = value;
}
  
function decreaseCount(a, b) {
    var input = b.nextElementSibling;
    var value = parseInt(input.value, 10);
    if (value > 1) {
      value = isNaN(value) ? 0 : value;
      value--;
      input.value = value;
    }
}

function getQuantidade(button) {
    var quantidadeInput = button.closest('.card-body').querySelector('input[type="text"]');
    return quantidadeInput.value;
}

function adicionarAoCarrinho(id, quantidade, nomeItem) {
    var tamanhoSelecionado = document.querySelector('input[name="tamanho"]:checked');

    if (!tamanhoSelecionado) {
        alert("Por favor, selecione o tamanho (Média ou Grande) da marmitex.");
        return;
    }

    var tamanho = tamanhoSelecionado.value;
    var preco = parseFloat(tamanhoSelecionado.getAttribute('data-preco'));

    var itemCarrinho = {
        idItem: id,
        quantidade: quantidade,
        nome: nomeItem,
        tamanho: tamanho,
        preco: preco,
        precoTotal: preco * quantidade
    };


    var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(itemCarrinho);
    console.log(carrinho);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    var marmitasAdicionadas = document.getElementById("marmitas-adicionadas");
    var listItem = document.createElement("li");
    listItem.textContent = nomeItem + " - " + tamanho + " - Quantidade: " + quantidade + " - R$ " +  (preco * quantidade).toFixed(2);
    marmitasAdicionadas.appendChild(listItem);
}


// Chame a função para preencher os cards quando a página for carregada
window.onload = preencherCardsComDados;


