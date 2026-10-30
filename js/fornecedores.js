const API = 'http://localhost:3000/fornecedores';

const form = document.getElementById('formFornecedor');
const lista = document.getElementById('listaFornecedores');
const mensagem = document.getElementById('mensagem');

async function carregarFornecedores() {
    try {
        const resposta = await fetch(API);
        const fornecedores = await resposta.json();

        if (!resposta.ok) {
            throw new Error('Erro ao buscar fornecedores');
        }

        lista.innerHTML = '';

        fornecedores.forEach(fornecedor => {
            lista.innerHTML += `
                <tr>
                    <td>${fornecedor.id_fornecedor}</td>
                    <td>${fornecedor.nome}</td>
                    <td>${fornecedor.cnpj}</td>
                    <td>${fornecedor.email}</td>
                    <td>${fornecedor.telefone}</td>
                    <td>${fornecedor.cidade || '-'}</td>
                    <td>${fornecedor.uf || '-'}</td>
                    <td>
                        <div class="acoes">
                            <button class="btn-editar" onclick="editarFornecedor(${fornecedor.id_fornecedor})">Editar</button>
                            <button class="btn-excluir" onclick="excluirFornecedor(${fornecedor.id_fornecedor})">Excluir</button>
                        </div>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        mensagem.textContent = 'Erro ao carregar fornecedores.';
    }
}

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('id_fornecedor').value;

    const fornecedor = {
        nome: document.getElementById('nome').value,
        cnpj: document.getElementById('cnpj').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        uf: document.getElementById('uf').value.toUpperCase()
    };

    try {
        const resposta = await fetch(id ? `${API}/${id}` : API, {
            method: id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fornecedor)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || 'Erro ao salvar fornecedor');
        }

        mensagem.textContent = resultado.mensagem;

        form.reset();
        document.getElementById('id_fornecedor').value = '';
        document.getElementById('btnSalvar').textContent = 'Cadastrar Fornecedor';

        carregarFornecedores();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
});

async function editarFornecedor(id) {
    try {
        const resposta = await fetch(`${API}/${id}`);
        const fornecedor = await resposta.json();

        if (!resposta.ok) {
            throw new Error('Fornecedor não encontrado');
        }

        document.getElementById('id_fornecedor').value = fornecedor.id_fornecedor;
        document.getElementById('nome').value = fornecedor.nome;
        document.getElementById('cnpj').value = fornecedor.cnpj;
        document.getElementById('email').value = fornecedor.email;
        document.getElementById('telefone').value = fornecedor.telefone;
        document.getElementById('endereco').value = fornecedor.endereco || '';
        document.getElementById('cidade').value = fornecedor.cidade || '';
        document.getElementById('uf').value = fornecedor.uf || '';

        document.getElementById('btnSalvar').textContent = 'Atualizar Fornecedor';

        window.scrollTo(0, 0);

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

async function excluirFornecedor(id) {
    if (!confirm('Deseja realmente excluir este fornecedor?')) {
        return;
    }

    try {
        const resposta = await fetch(`${API}/${id}`, {
            method: 'DELETE'
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro);
        }

        mensagem.textContent = resultado.mensagem;

        carregarFornecedores();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

document.getElementById('btnLimpar').addEventListener('click', function() {
    form.reset();

    document.getElementById('id_fornecedor').value = '';
    document.getElementById('btnSalvar').textContent = 'Cadastrar Fornecedor';

    mensagem.textContent = '';
});

document.getElementById('pesquisa').addEventListener('input', function() {
    const pesquisa = this.value.toLowerCase();
    const linhas = lista.querySelectorAll('tr');

    linhas.forEach(linha => {
        linha.style.display = linha.textContent.toLowerCase().includes(pesquisa) ? '' : 'none';
    });
});

carregarFornecedores();

