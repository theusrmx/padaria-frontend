const baseUrl = 'http://localhost:8080/produtos';
const token = localStorage.getItem('token');

function preencherListaComDados() {
    fetch(baseUrl + '/all', {
        method: 'GET',
        headers: {
            'Authorization': token //token de usuario
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição.');
            }
            return response.json();
        })
        .then(dadosDaAPI => {
            const listaContainer = document.getElementById('lista-container');
            listaContainer.innerHTML = '';  // Limpa todo o conteúdo anterior

            if (dadosDaAPI && Array.isArray(dadosDaAPI) && dadosDaAPI.length > 0) {
                dadosDaAPI.forEach(item => {
                    const newRow = listaContainer.insertRow();

                    const imagemCell = newRow.insertCell(0);
                    const imagemProduto = document.createElement('img');
                    imagemProduto.src = item.imagemProduto; 
                    imagemProduto.alt = item.nomeProduto; 
                    imagemProduto.style.width = '100px'; 
                    imagemProduto.style.height = 'auto'; 
                    imagemCell.appendChild(imagemProduto);

                    const nomeProdutoCell = newRow.insertCell(1);
                    nomeProdutoCell.textContent = item.nomeProduto;

                    const descricaoCell = newRow.insertCell(2);
                    descricaoCell.textContent = item.descricao;

                    const precoMedioCell = newRow.insertCell(3);
                    precoMedioCell.textContent = `R$ ${item.precoMedio.toFixed(2)}`;

                    const precoGrandeCell = newRow.insertCell(4);
                    precoGrandeCell.textContent = `R$ ${item.precoGrande.toFixed(2)}`;

                    const diasDisponiveisCell = newRow.insertCell(5);
                    const diasDisponiveis = [];

                    if (item.segundaDisponivel) {
                        diasDisponiveis.push('Seg');
                    }
                    if (item.tercaDisponivel) {
                        diasDisponiveis.push('Ter');
                    }
                    if (item.quartaDisponivel) {
                        diasDisponiveis.push('Qua');
                    }
                    if (item.quintaDisponivel) {
                        diasDisponiveis.push('Qui');
                    }
                    if (item.sextaDisponivel) {
                        diasDisponiveis.push('Sex');
                    }
                    if (item.sabadoDisponivel) {
                        diasDisponiveis.push('Sáb');
                    }
                    if (item.domingoDisponivel) {
                        diasDisponiveis.push('Dom');
                    }

                    diasDisponiveisCell.textContent = `${diasDisponiveis.join(', ')}`;

                    const acoesCell = newRow.insertCell(6);
                    const editarButton = document.createElement('button');
                    editarButton.className = 'btn btn-primary';
                    editarButton.textContent = 'Editar';
                    editarButton.setAttribute('data-toggle', 'modal');
                    editarButton.setAttribute('data-target', '#editarModal');
                    editarButton.addEventListener('click', () => editarProduto(item.idProduto)); // Substitua por sua função de edição
                    acoesCell.appendChild(editarButton);

                    const excluirButton = document.createElement('button');
                    excluirButton.className = 'btn btn-danger';
                    excluirButton.textContent = 'Excluir';
                    excluirButton.addEventListener('click', () => excluirProduto(item.idProduto)); // Substitua por sua função de exclusão
                    acoesCell.appendChild(excluirButton);

                    
                });

            } else {
                // Se a API estiver vazia, exibe uma mensagem informando que não há produtos.
                const mensagemVazia = document.createElement('p');
                mensagemVazia.textContent = "Nenhum produto encontrado.";
                listaContainer.appendChild(mensagemVazia);
            }
        })
        .catch(error => {
            console.error(error);

            // Exibe a mensagem de erro da resposta
            const mensagemErro = document.createElement('p');
            mensagemErro.textContent = `Erro: ${error.message}`;
            listaContainer.appendChild(mensagemErro);
        });
}

// Chame a função para preencher a lista de produtos quando a página for carregada
window.onload = preencherListaComDados();


//////////////////////// ADICIONAR PRODUTO

// Quando o botão "Adicionar" for clicado
document.getElementById('adicionarProduto').addEventListener('click', function () {
    // Capture os valores dos campos do formulário
    const nomeProduto = document.getElementById('nomeProduto').value;
    const descricao = document.getElementById('descricao').value;
    const precoMedio = parseFloat(document.getElementById('precoMedio').value);
    const precoGrande = parseFloat(document.getElementById('precoGrande').value);
    const imagemProduto = document.getElementById('imagemProduto').value;

    // Crie um objeto com os dados do produto
    const novoProduto = {
        nomeProduto: nomeProduto,
        descricao: descricao,
        precoMedio: precoMedio,
        precoGrande: precoGrande,
        imagemProduto: imagemProduto,
        segundaDisponivel: document.getElementById('segundaDisponivel').checked,
        tercaDisponivel: document.getElementById('tercaDisponivel').checked,
        quartaDisponivel: document.getElementById('quartaDisponivel').checked,
        quintaDisponivel: document.getElementById('quintaDisponivel').checked,
        sextaDisponivel: document.getElementById('sextaDisponivel').checked,
        sabadoDisponivel: document.getElementById('sabadoDisponivel').checked,
        domingoDisponivel: document.getElementById('domingoDisponivel').checked
    };

    // Realize uma solicitação POST para adicionar o novo produto
    fetch(baseUrl + '/cadastrar-produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token //token de usuario
        },
        body: JSON.stringify(novoProduto)
    })
    .then(response => {
        if (response.ok) {
            // Produto adicionado com sucesso, você pode fechar o modal ou fazer outra ação
            // Por exemplo, fechar o modal:
            $('#adicionarModal').modal('hide');
            alert("Produto adicionado com sucesso!");
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            // Lidar com erros, por exemplo, exibir uma mensagem de erro
            console.error('Erro ao adicionar o produto.');
            alert('Erro ao adicionar o produto.')
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
});


/////////////////// EDITAR PRODUTO
function editarProduto(idProduto) {
    console.log(idProduto);
    // Fazer uma solicitação para obter os detalhes do produto pelo ID
    fetch(baseUrl + `/${idProduto}`)
        .then(response => response.json())
        .then(data => {
            // Preencher os campos do formulário no modal com os dados do produto
            document.getElementById('nomeProdutoEditar').value = data.nomeProduto;
            document.getElementById('descricaoEditar').value = data.descricao;
            document.getElementById('precoMedioEditar').value = data.precoMedio;
            document.getElementById('precoGrandeEditar').value = data.precoGrande;
            document.getElementById('imagemProdutoEditar').value = data.imagemProduto;

            // Preencher os campos de dias da semana disponíveis
            document.getElementById('segundaEditar').checked = data.segundaDisponivel;
            document.getElementById('tercaEditar').checked = data.tercaDisponivel;
            document.getElementById('quartaEditar').checked = data.quartaDisponivel;
            document.getElementById('quintaEditar').checked = data.quintaDisponivel;
            document.getElementById('sextaEditar').checked = data.sextaDisponivel;
            document.getElementById('sabadoEditar').checked = data.sabadoDisponivel;
            document.getElementById('domingoEditar').checked = data.domingoDisponivel;

            // Adicionar um ouvinte de evento para o botão "Salvar Alterações"
            document.getElementById('salvarAlteracoes').addEventListener('click', () => {
                // Coletar os dados atualizados do modal e criar um objeto com eles
                const dadosAtualizados = {
                    nomeProduto: document.getElementById('nomeProdutoEditar').value,
                    descricao: document.getElementById('descricaoEditar').value,
                    precoMedio: document.getElementById('precoMedioEditar').value,
                    precoGrande: document.getElementById('precoGrandeEditar').value,
                    imagemProduto: document.getElementById('imagemProdutoEditar').value,
                    segundaDisponivel: document.getElementById('segundaEditar').checked,
                    tercaDisponivel: document.getElementById('tercaEditar').checked,
                    quartaDisponivel: document.getElementById('quartaEditar').checked,
                    quintaDisponivel: document.getElementById('quintaEditar').checked,
                    sextaDisponivel: document.getElementById('sextaEditar').checked,
                    sabadoDisponivel: document.getElementById('sabadoEditar').checked,
                    domingoDisponivel: document.getElementById('domingoEditar').checked
                };

                // Enviar os dados atualizados ao servidor para a edição do produto (você pode usar um fetch)
                fetch(baseUrl + `/edit/${idProduto}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token //token de usuario
                    },
                    body: JSON.stringify(dadosAtualizados)
                    })
                    .then(response => response.json())
                    .then(data_edit => {
                        alert('Produto editado com sucesso');
                        $('#editarModal').modal('hide'); // Feche o modal após a edição ser concluída
                    })
                    .catch(error_edit => console.log('Erro ao editar produto', error_edit), alert('Erro ao editar produto'));
            });
        })
        .catch(error_edit => {
            alert('Erro ao obter detalhes do produto');
            console.log('Erro ao obter detalhes do produto: ', error_edit)
        });
}


///////////EXCLUIR PRODUTO
function excluirProduto(idProduto) {
    if (confirm("Tem certeza de que deseja excluir este produto?")) {
        fetch(baseUrl + `/delete/${idProduto}`, {
            method: 'DELETE',
            headers:{
                'Authorization': token //token de usuario
            }
        })
        .then(response => {
            if (response.ok) {
                // Produto excluído com sucesso
                alert("Produto excluído com sucesso!");
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                alert('Erro ao excluir o produto.');
            }
        })
        .catch(error => {
            console.log('Erro na requisição: ', error)
            alert('Erro na requisição');
        });
    }
}