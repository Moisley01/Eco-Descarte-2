// ===============================
// USUÁRIO
// ===============================
const user = JSON.parse(localStorage.getItem("usuario"));

if (!user) {
    window.location.href = "../login/login.html";
}

// garante pontos sempre definidos
user.pontos = user.pontos || 0;

// preencher dados na tela
document.getElementById("userName").innerText = user.nome;
document.getElementById("userPoints").innerText = user.pontos;
document.getElementById("email").innerText = user.email;
document.getElementById("points").innerText = user.pontos;


// ===============================
// NAVEGAÇÃO ENTRE TELAS
// ===============================
function showPage(page) {

    document.querySelectorAll(".page").forEach(p => {
        p.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");
}


// ===============================
// MISSÃO (BASE DO SISTEMA)
// ===============================
let missaoAtual = null;


// INICIAR MISSÃO
function iniciarMissao() {

    if (missaoAtual) {
        alert("Você já tem uma missão ativa!");
        return;
    }

    if (!user.id) {
        alert("Usuário inválido");
        return;
    }

    const pontoSelecionado = {
        id: 1,
        nome: "Ecoponto Centro",
        latitude: -3.1190,
        longitude: -60.0217
    };

    missaoAtual = {
        id: Date.now(),
        usuarioId: user.id,
        ponto: pontoSelecionado,
        status: "ativa",
        tipoLixo: null,
        quantidade: null,
        distancia: null,
        pontosBase: 10,
        createdAt: new Date()
    };

    document.getElementById("btnConcluir").style.display = "inline-block";

    console.log("Missão criada:", missaoAtual);

    alert("Missão iniciada! Vá até o ponto de coleta.");
}


// CONCLUIR MISSÃO
function concluirMissao() {

    if (!missaoAtual) {
        alert("Nenhuma missão ativa!");
        return;
    }

    missaoAtual.status = "concluida";

    let pontosGanhos = missaoAtual.pontosBase;

    user.pontos += pontosGanhos;

    localStorage.setItem("usuario", JSON.stringify(user));

    document.getElementById("userPoints").innerText = user.pontos;
    document.getElementById("points").innerText = user.pontos;

    document.getElementById("btnConcluir").style.display = "none";

    console.log("Missão finalizada:", missaoAtual);

    alert(`Missão concluída! +${pontosGanhos} pontos`);

    missaoAtual = null;
}