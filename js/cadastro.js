const formulario = document.getElementById('formCadastro');
const mensagem = document.getElementById('mensagem');

formulario.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha.length < 8) {
        mensagem.style.color = '#f87171';
        mensagem.textContent = 'A senha deve ter pelo menos 8 caracteres!';
        return;
    }

    if (senha !== confirmarSenha) {
        mensagem.style.color = '#f87171';
        mensagem.textContent = 'As senhas não são iguais!';
        return;
    }

    try {
        const resposta = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.style.color = '#f87171';
            mensagem.textContent = dados.erro;
            return;
        }

        mensagem.style.color = '#818cf8';
        mensagem.textContent = 'Cadastro realizado com sucesso!';

        formulario.reset();

    } catch (erro) {
        mensagem.style.color = '#f87171';
        mensagem.textContent = 'Erro ao conectar com o servidor!';
    }
});