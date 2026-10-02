const formCliente = document.getElementById("formCliente");
const enderecos = document.getElementById("enderecos");
const btnAdicionarEndereco = document.getElementById("btnAdicionarEndereco");
const mensagem = document.getElementById("mensagem");

let quantidadeEnderecos = 1;

btnAdicionarEndereco.addEventListener("click", function () {

    quantidadeEnderecos++;

    const novoEndereco = document.createElement("div");

    novoEndereco.classList.add("endereco");

    novoEndereco.innerHTML = `
        <div class="endereco-topo">
            <h3>Endereço ${quantidadeEnderecos}</h3>
            <button type="button" class="btn-remover">Remover</button>
        </div>

        <div class="linha">
            <div class="campo pequeno">
                <label>CEP</label>
                <input type="text" name="cep[]" placeholder="00000-000">
            </div>

            <div class="campo grande">
                <label>Rua</label>
                <input type="text" name="rua[]" placeholder="Nome da rua">
            </div>

            <div class="campo pequeno">
                <label>Número</label>
                <input type="text" name="numero[]" placeholder="Nº">
            </div>
        </div>

        <div class="linha">
            <div class="campo">
                <label>Bairro</label>
                <input type="text" name="bairro[]" placeholder="Bairro">
            </div>

            <div class="campo">
                <label>Cidade</label>
                <input type="text" name="cidade[]" placeholder="Cidade">
            </div>

            <div class="campo pequeno">
                <label>UF</label>
                <select name="uf[]">
                    <option value="">UF</option>
                    <option>PR</option>
                    <option>SP</option>
                    <option>SC</option>
                    <option>RS</option>
                    <option>MS</option>
                    <option>MT</option>
                </select>
            </div>
        </div>

        <div class="campo">
            <label>Complemento</label>
            <input type="text" name="complemento[]" placeholder="Apartamento, bloco, referência...">
        </div>
    `;

    enderecos.appendChild(novoEndereco);

    atualizarBotoesRemover();
});

function atualizarBotoesRemover() {

    const botoes = document.querySelectorAll(".btn-remover");

    botoes.forEach(function (botao) {

        botao.onclick = function () {

            botao.closest(".endereco").remove();

            atualizarNumeracao();
        };
    });
}

function atualizarNumeracao() {

    const lista = document.querySelectorAll(".endereco");

    lista.forEach(function (endereco, indice) {

        const titulo = endereco.querySelector("h3");

        titulo.textContent = "Endereço " + (indice + 1);
    });

    quantidadeEnderecos = lista.length;
}

formCliente.addEventListener("submit", function (event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();

    if (nome === "" || cpf === "" || email === "" || telefone === "") {

        mensagem.textContent = "Preencha todos os dados do cliente.";
        mensagem.className = "mensagem-erro";

        return;
    }

    mensagem.textContent = "Cliente preenchido com sucesso. A conexão com o banco será feita posteriormente.";
    mensagem.className = "mensagem-sucesso";
});

formCliente.addEventListener("reset", function () {

    setTimeout(function () {

        mensagem.textContent = "";
        mensagem.className = "";

        const lista = document.querySelectorAll(".endereco");

        lista.forEach(function (endereco, indice) {

            if (indice > 0) {
                endereco.remove();
            }
        });

        quantidadeEnderecos = 1;

    }, 0);
});

atualizarBotoesRemover();
