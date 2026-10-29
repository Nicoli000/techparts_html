const formCliente = document.getElementById("formCliente");
const enderecos = document.getElementById("enderecos");
const btnAdicionarEndereco = document.getElementById("btnAdicionarEndereco");
const mensagem = document.getElementById("mensagem");
const tabelaClientes = document.getElementById("tabelaClientes");

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
                    <option value="PR">PR</option>
                    <option value="SP">SP</option>
                    <option value="SC">SC</option>
                    <option value="RS">RS</option>
                    <option value="MS">MS</option>
                    <option value="MT">MT</option>
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
        endereco.querySelector("h3").textContent = "Endereço " + (indice + 1);
    });

    quantidadeEnderecos = lista.length;
}

formCliente.addEventListener("submit", async function (event) {
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

    const listaEnderecos = document.querySelectorAll(".endereco");
    const dadosEnderecos = [];

    listaEnderecos.forEach(function (endereco) {
        dadosEnderecos.push({
            cep: endereco.querySelector('[name="cep[]"]').value.trim(),
            rua: endereco.querySelector('[name="rua[]"]').value.trim(),
            numero: endereco.querySelector('[name="numero[]"]').value.trim(),
            bairro: endereco.querySelector('[name="bairro[]"]').value.trim(),
            cidade: endereco.querySelector('[name="cidade[]"]').value.trim(),
            uf: endereco.querySelector('[name="uf[]"]').value,
            complemento: endereco.querySelector('[name="complemento[]"]').value.trim()
        });
    });

    const dadosCliente = {
        nome: nome,
        cpf: cpf,
        email: email,
        telefone: telefone,
        enderecos: dadosEnderecos
    };

    try {
        mensagem.textContent = "Cadastrando cliente...";
        mensagem.className = "";

        const resposta = await fetch("http://localhost:3000/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosCliente)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.erro ||
                resultado.mensagem ||
                "Não foi possível cadastrar o cliente."
            );
        }

        mensagem.textContent = resultado.mensagem || "Cliente cadastrado com sucesso!";
        mensagem.className = "mensagem-sucesso";

        formCliente.reset();
        carregarClientes();

    } catch (erro) {
        mensagem.textContent = "Erro ao cadastrar: " + erro.message;
        mensagem.className = "mensagem-erro";
        console.error("Erro no cadastro:", erro);
    }
});

async function carregarClientes() {
    try {
        const resposta = await fetch("http://localhost:3000/clientes");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os clientes.");
        }

        const clientes = await resposta.json();

        tabelaClientes.innerHTML = "";

        if (clientes.length === 0) {
            tabelaClientes.innerHTML = `
                <tr>
                    <td colspan="6" class="vazio">
                        Nenhum cliente cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        clientes.forEach(function (cliente) {
            const linha = document.createElement("tr");

            const id = document.createElement("td");
            id.textContent = cliente.id_cliente;

            const nome = document.createElement("td");
            nome.textContent = cliente.nome;

            const cpf = document.createElement("td");
            cpf.textContent = cliente.cpf;

            const email = document.createElement("td");
            email.textContent = cliente.email;

            const telefone = document.createElement("td");
            telefone.textContent = cliente.telefone;

            const acoes = document.createElement("td");
            const botao = document.createElement("button");

            botao.type = "button";
            botao.textContent = "Ver endereços";
            botao.className = "btn-remover";
            botao.style.color = "#4f8cff";

            botao.addEventListener("click", function () {
                consultarEnderecos(cliente.id_cliente, cliente.nome);
            });

            acoes.appendChild(botao);

            linha.appendChild(id);
            linha.appendChild(nome);
            linha.appendChild(cpf);
            linha.appendChild(email);
            linha.appendChild(telefone);
            linha.appendChild(acoes);

            tabelaClientes.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro ao carregar clientes:", erro);

        tabelaClientes.innerHTML = `
            <tr>
                <td colspan="6" class="vazio">
                    Não foi possível carregar os clientes. Verifique se o servidor está ligado.
                </td>
            </tr>
        `;
    }
}

async function consultarEnderecos(idCliente, nomeCliente) {
    try {
        const resposta = await fetch(
            `http://localhost:3000/clientes/${idCliente}/endereco`
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível consultar os endereços.");
        }

        const lista = await resposta.json();

        if (lista.length === 0) {
            alert("O cliente " + nomeCliente + " não possui endereços cadastrados.");
            return;
        }

        let texto = "Endereços de " + nomeCliente + ":\n\n";

        lista.forEach(function (endereco, indice) {
            texto += "Endereço " + (indice + 1) + "\n";
            texto += "CEP: " + (endereco.cep || "") + "\n";
            texto += "Rua: " + (endereco.rua || "") + ", " + (endereco.numero || "") + "\n";
            texto += "Bairro: " + (endereco.bairro || "") + "\n";
            texto += "Cidade: " + (endereco.cidade || "") + " - " + (endereco.uf || "") + "\n";
            texto += "Complemento: " + (endereco.complemento || "Não informado") + "\n\n";
        });

        alert(texto);

    } catch (erro) {
        console.error("Erro ao consultar endereços:", erro);
        alert("Erro ao consultar os endereços. Verifique se o servidor está ligado.");
    }
}

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
        atualizarNumeracao();
    }, 0);
});

atualizarBotoesRemover();
carregarClientes();

