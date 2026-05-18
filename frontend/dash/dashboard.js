const API = 'https://eco-descarte-2-production.up.railway.app';


// ===============================
// USUÁRIO
// ===============================
const user = JSON.parse(localStorage.getItem("usuario"));

if (!user) {
    window.location.href = "../login/login.html";
}


// ===============================
// MISSÃO ATUAL
// ===============================
let missaoAtual = null;


// ===============================
// CARREGAR USUÁRIO
// ===============================
async function carregarUsuario() {

    try {

        const resposta = await fetch(`${API}/usuarios/${user.id}`);

        const usuarioAtualizado = await resposta.json();

        // atualizar localStorage
        localStorage.setItem(
            "usuario",
            JSON.stringify(usuarioAtualizado)
        );

        // atualizar tela
        document.getElementById("userName").innerText =
            usuarioAtualizado.nome;

        document.getElementById("userPoints").innerText =
            usuarioAtualizado.pontos;

        document.getElementById("email").innerText =
            usuarioAtualizado.email;

        document.getElementById("points").innerText =
            usuarioAtualizado.pontos;

    } catch (erro) {

        console.log(erro);

        alert("Erro ao carregar usuário");
    }
}


// ===============================
// CARREGAR MISSÃO ATIVA
// ===============================
async function carregarMissaoAtiva() {

    try {

        const resposta = await fetch(
            `${API}/missoes/ativa/${user.id}`
        );

        const missao = await resposta.json();

        missaoAtual = missao;

        // mostrar botão concluir se existir missão
        if (missaoAtual) {

            document.getElementById("btnConcluir")
                .style.display = "inline-block";

        } else {

            document.getElementById("btnConcluir")
                .style.display = "none";
        }

    } catch (erro) {

        console.log(erro);
    }
}


// ===============================
// NAVEGAÇÃO
// ===============================
function showPage(page) {

    document.querySelectorAll(".page").forEach(p => {
        p.classList.add("hidden");
    });

    document.getElementById(page)
        .classList.remove("hidden");
}


// ===============================
// INICIAR MISSÃO
// ===============================
async function iniciarMissao() {

    try {

        // impedir duas missões
        if (missaoAtual) {

            alert("Você já possui uma missão ativa!");
            return;
        }

        const pontoSelecionado = {
            nome: "Ecoponto Centro",
            latitude: -3.1190,
            longitude: -60.0217
        };

        const resposta = await fetch(`${API}/missoes`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                usuarioId: user.id,

                ponto: pontoSelecionado,

                pontosBase: 10
            })
        });

        const dados = await resposta.json();

        if (!dados.success) {

            alert("Erro ao iniciar missão");
            return;
        }

        alert("Missão iniciada!");

        await carregarMissaoAtiva();

    } catch (erro) {

        console.log(erro);

        alert("Erro ao iniciar missão");
    }
}


// ===============================
// CONCLUIR MISSÃO
// ===============================
async function concluirMissao() {

    try {

        if (!missaoAtual) {

            alert("Nenhuma missão ativa!");
            return;
        }

        const resposta = await fetch(

            `${API}/missoes/${missaoAtual.id}/concluir`,

            {
                method: 'PUT'
            }
        );

        const dados = await resposta.json();

        if (!dados.success) {

            alert("Erro ao concluir missão");
            return;
        }

        // atualizar usuário no localStorage
        localStorage.setItem(
            "usuario",
            JSON.stringify(dados.usuario)
        );

        alert(
            `Missão concluída! +${dados.pontosGanhos} pontos`
        );

        missaoAtual = null;

        // atualizar tela
        await carregarUsuario();

        await carregarMissaoAtiva();

    } catch (erro) {

        console.log(erro);

        alert("Erro ao concluir missão");
    }
}


// ===============================
// INICIAR DASHBOARD
// ===============================
carregarUsuario();

carregarMissaoAtiva();