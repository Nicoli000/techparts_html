const API = 'http://localhost:3000/produtos';

const form = document.getElementById('formProduto');
const lista = document.getElementById('listaProdutos');
const mensagem = document.getElementById('mensagem');

async function carregarProdutos() {
    try {
        const resposta = await fetch(API);
        const produtos = await resposta.json();

        lista.innerHTML = '';

        produtos.forEach(produto => {
            lista.innerHTML += `
                <tr>
                    <td>${produto.id}</td>
                    <td>${produto.nome}</td>
                    <td>${produto.categoria}</td>
                    <td>${produto.marca}</td>
                    <td>${produto.modelo}</td>
                    <td>R$ ${Number(produto.preco).toFixed(2)}</td>
                    <td>${produto.quantidade}</td>
                    <td>${produto.fornecedor_id || '-'}</td>
                    <td>
                        <div class="acoes">
                            <button class="btn-editar" onclick="editarProduto(${produto.id})">Editar</button>
                            <button class="btn-excluir" onclick="excluirProduto(${produto.id})">Excluir</button>
                        </div>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        mensagem.textContent = 'Erro ao carregar produtos.';
    }
}

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('id').value;

    const produto = {
        nome: document.getElementById('nome').value,
        categoria: document.getElementById('categoria').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        descricao: document.getElementById('descricao').value,
        preco: document.getElementById('preco').value,
        quantidade: document.getElementById('quantidade').value,
        fornecedor_id: document.getElementById('fornecedor_id').value || null
    };

    try {
        let resposta;

        if (id) {
            resposta = await fetch(`${API}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
        } else {
            resposta = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
        }

        if (!resposta.ok) {
            throw new Error('Erro ao salvar produto');
        }

        mensagem.textContent = id ? 'Produto atualizado!' : 'Produto cadastrado!';

        form.reset();
        document.getElementById('id').value = '';
        document.getElementById('btnSalvar').textContent = 'Cadastrar Produto';

        carregarProdutos();

    } catch (erro) {
        mensagem.textContent = 'Erro ao salvar produto. Verifique o servidor e o banco de dados.';
    }
});

async function editarProduto(id) {
    try {
        const resposta = await fetch(`${API}/${id}`);
        const produto = await resposta.json();

        document.getElementById('id').value = produto.id;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('categoria').value = produto.categoria;
        document.getElementById('marca').value = produto.marca;
        document.getElementById('modelo').value = produto.modelo;
        document.getElementById('descricao').value = produto.descricao || '';
        document.getElementById('preco').value = produto.preco;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('fornecedor_id').value = produto.fornecedor_id || '';

        document.getElementById('btnSalvar').textContent = 'Atualizar Produto';

        window.scrollTo(0, 0);

    } catch (erro) {
        mensagem.textContent = 'Erro ao buscar produto.';
    }
}

async function excluirProduto(id) {
    if (!confirm('Deseja realmente excluir este produto?')) {
        return;
    }

    try {
        const resposta = await fetch(`${API}/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error('Erro ao excluir');
        }

        mensagem.textContent = 'Produto excluído!';
        carregarProdutos();

    } catch (erro) {
        mensagem.textContent = 'Erro ao excluir produto.';
    }
}

document.getElementById('btnLimpar').addEventListener('click', function() {
    form.reset();
    document.getElementById('id').value = '';
    document.getElementById('btnSalvar').textContent = 'Cadastrar Produto';
    mensagem.textContent = '';
});

document.getElementById('pesquisa').addEventListener('input', function() {
    const pesquisa = this.value.toLowerCase();
    const linhas = lista.querySelectorAll('tr');

    linhas.forEach(linha => {
        linha.style.display = linha.textContent.toLowerCase().includes(pesquisa) ? '' : 'none';
    });
});

carregarProdutos();
