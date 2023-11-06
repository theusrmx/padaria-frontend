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
                                    <input class="form-check-input" type="radio" name="tamanho" value="media" data-preco="${item.precoMedio}">
                                    <label class="form-check-label">
                                        Média - R$ ${item.precoMedio.toFixed(2)}
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="tamanho" value="grande" data-preco="${item.precoGrande}">
                                    <label class="form-check-label">
                                        Grande - R$ ${item.precoGrande.toFixed(2)}
                                    </label>
                                </div>
                                <br>
                                <a href="javascript:void(0);" class="btn btn-primary" onclick="adicionarAoCarrinho('${item.nomeProduto}')">Adicionar ao Carrinho</a>
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
// Função para adicionar um item ao carrinho e listar as marmitas adicionadas
function adicionarAoCarrinho(nome) {
    var tamanhoSelecionado = document.querySelector('input[name="tamanho"]:checked');

    if (!tamanhoSelecionado) {
        alert("Por favor, selecione o tamanho (Média ou Grande) da marmitex.");
        return;
    }

    var tamanho = tamanhoSelecionado.value;
    var preco = parseFloat(tamanhoSelecionado.getAttribute('data-preco'));

    var itemCarrinho = {
        nome: nome,
        tamanho: tamanho,
        preco: preco
    };

    var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(itemCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    var marmitasAdicionadas = document.getElementById("marmitas-adicionadas");
    var listItem = document.createElement("li");
    listItem.textContent = nome + " - " + tamanho.charAt(0).toUpperCase() + tamanho.slice(1) + " - R$ " + preco.toFixed(2);
    marmitasAdicionadas.appendChild(listItem);
}

// Chame a função para preencher os cards quando a página for carregada
window.onload = preencherCardsComDados;