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

            document.getElementById("statusMissao")
                .innerText = "Missão ativa em andamento";

        } else {

            document.getElementById("btnConcluir")
                .style.display = "none";

            document.getElementById("statusMissao")
                .innerText = "Nenhuma missão ativa";
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
            'Missão enviada para análise do colaborador!'
        );

        missaoAtual = null;

        // atualizar tela
        await carregarUsuario();

        await carregarMissaoAtiva();

        await carregarHistorico();

    } catch (erro) {

        console.log(erro);

        alert("Erro ao concluir missão");
    }
}


// ===============================
// RESGATAR PRODUTO
// ===============================
async function resgatarProduto(produtoId) {

    try {

        const resposta = await fetch(`${API}/resgatar`, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                usuarioId: user.id,

                produtoId
            })
        });

        const dados = await resposta.json();

        if (!dados.success) {

            alert(dados.mensagem);
            return;
        }

        // atualizar usuário
        localStorage.setItem(
            "usuario",
            JSON.stringify(dados.usuario)
        );

        alert(
            `${dados.mensagem}\nCódigo: ${dados.codigo}`
        );

        // atualizar tela
        await carregarUsuario();

        await carregarResgates();

    } catch (erro) {

        console.log(erro);

        alert("Erro ao resgatar produto");
    }
}


// ===============================
// LOGOUT
// ===============================
function logout() {

    localStorage.removeItem("usuario");

    window.location.href = "../login/login.html";
}


// ===============================
// CARREGAR HISTÓRICO
// ===============================
async function carregarHistorico() {

    try {

        const resposta = await fetch(`${API}/missoes`);

        const missoes = await resposta.json();

        // pegar apenas missões do usuário
        const minhasMissoes = missoes.filter(missao =>
            missao.usuario_id === user.id
        );

        const historico =
            document.getElementById("historicoMissoes");

        historico.innerHTML = "";

        // nenhuma missão
        if (minhasMissoes.length === 0) {

            historico.innerHTML =
                "<p>Nenhuma missão encontrada.</p>";

            return;
        }

        minhasMissoes.forEach(missao => {

            historico.innerHTML += `

                <div class="cardMissao">

                    <h3>${missao.ponto_nome}</h3>

                    <p>Status: ${missao.status}</p>

                    <p>Pontos: ${missao.pontos}</p>

                </div>
            `;
        });

    } catch (erro) {

        console.log(erro);
    }
}


// ===============================
// CARREGAR PRODUTOS
// ===============================
async function carregarProdutos() {

    try {

        const resposta = await fetch(`${API}/produtos`);

        const produtos = await resposta.json();

        const produtosDiv =
            document.getElementById("produtos");

        produtosDiv.innerHTML = "";

        produtos.forEach(produto => {

            produtosDiv.innerHTML += `

                <div class="produtoCard">

                    <img
                        src="${produto.image}"
                        alt="${produto.name}"
                        width="150"
                    >

                    <h3>${produto.name}</h3>

                    <p>${produto.price} pontos</p>

                    <button onclick="resgatarProduto(${produto.id})">
                        Resgatar
                    </button>

                </div>
            `;
        });

    } catch (erro) {

        console.log(erro);
    }
}


// ===============================
// CARREGAR RESGATES
// ===============================
async function carregarResgates() {

    try {

        const resposta = await fetch(
            `${API}/resgates/${user.id}`
        );

        const resgates = await resposta.json();

        const lista =
            document.getElementById("listaResgates");

        lista.innerHTML = "";

        // nenhum resgate
        if (resgates.length === 0) {

            lista.innerHTML =
                "<p>Nenhum resgate realizado.</p>";

            return;
        }

        resgates.forEach(resgate => {

            lista.innerHTML += `

                <div class="cardResgate">

                    <h3>${resgate.produto_nome}</h3>

                    <p>
                        Código:
                        <strong>${resgate.codigo}</strong>
                    </p>

                    <p>
                        Pontos gastos:
                        ${resgate.pontos_gastos}
                    </p>

                    <p>
                        Resgatado em:
                        ${new Date(
                            resgate.created_at
                        ).toLocaleDateString()}
                    </p>

                </div>
            `;
        });

    } catch (erro) {

        console.log(erro);
    }
}


// ===============================
// INICIAR DASHBOARD
// ===============================
carregarUsuario();

carregarMissaoAtiva();

carregarHistorico();

carregarProdutos();

carregarResgates();