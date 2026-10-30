
const formulario = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');

formulario.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (email === '' || senha === '') {
        mensagem.textContent = 'Preencha todos os campos!';
        return;
    }

    try {
        const resposta = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            mensagem.textContent = dados.erro;
            return;
        }

        mensagem.style.color = '#818cf8';
        mensagem.textContent = 'Login realizado com sucesso! Bem-vindo, ' + dados.usuario.nome;

    } catch (erro) {
        mensagem.style.color = '#f87171';
        mensagem.textContent = 'Não foi possível conectar ao servidor.';
    }
});

