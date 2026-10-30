const dataAtual = document.getElementById("dataAtual");

const hoje = new Date();

dataAtual.textContent = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
});

fetch("http://localhost:3000/dashboard/resumo")
.then(res => {
    if (!res.ok) {
        throw new Error("Erro ao buscar dados");
    }

    return res.json();
})
.then(dados => {
    document.getElementById("totalClientes").textContent = dados.clientes;
})
.catch(erro => {
    console.error("Erro ao carregar dashboard:", erro);
});

