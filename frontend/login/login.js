const form = document.getElementById('loginForm');

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {

        const resposta = await fetch('https://eco-descarte-2-production.up.railway.app/login', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email,
                senha
            })

        });

        const dados = await resposta.json();

if (dados.success) {

    localStorage.setItem('usuario', JSON.stringify(dados.usuario));

    alert('Login realizado com sucesso!');

    window.location.href = '../dash/dashboard.html';

} else {

    alert(dados.mensagem);

}

    } catch(erro){

        console.log(erro);

        alert('Erro ao conectar com o servidor');

    }

});