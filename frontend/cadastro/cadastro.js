const form = document.getElementById('cadastroForm');

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {

        const resposta = await fetch('https://eco-descarte-2-production.up.railway.app/cadastro', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                nome,
                email,
                senha
            })

        });

        const dados = await resposta.json();

        if(dados.success){

            alert(dados.mensagem);

            window.location.href = '../login/login.html';

        } else {

            alert(dados.mensagem);

        }

    } catch(erro){

        console.log(erro);

        alert('Erro ao cadastrar');

    }

});