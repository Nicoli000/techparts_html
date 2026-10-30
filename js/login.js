const formulario = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');

formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (email === '' || senha === '') {
        mensagem.textContent = 'Preencha todos os campos!';
        return;
    }

    mensagem.textContent = 'Tela pronta! Aguardando conexão com o servidor.';
});