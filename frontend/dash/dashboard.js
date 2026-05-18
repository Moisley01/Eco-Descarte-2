// pegar usuário do login
const user = JSON.parse(localStorage.getItem("usuario"));

if (!user) {
    window.location.href = "../login/login.html";
}

// preencher dados
document.getElementById("userName").innerText = user.nome;
document.getElementById("userPoints").innerText = user.pontos;
document.getElementById("email").innerText = user.email;
document.getElementById("points").innerText = user.pontos;

// navegação entre páginas
function showPage(page) {

    document.querySelectorAll(".page").forEach(p => {
        p.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");
}

// MISSÃO (base futura da gamificação)
function iniciarMissao() {
    alert("Missão iniciada! Vá até o ponto de coleta.");
}

function initMap() {

    const centro = { lat: -3.1190, lng: -60.0217 }; // Manaus exemplo

    const map = new google.maps.Map(document.getElementById("mapaGoogle"), {
        zoom: 12,
        center: centro,
    });

    // exemplo de pontos de coleta
    new google.maps.Marker({
        position: { lat: -3.1190, lng: -60.0217 },
        map: map,
        title: "Ponto de Coleta 1"
    });

    new google.maps.Marker({
        position: { lat: -3.0900, lng: -60.0100 },
        map: map,
        title: "Ponto de Coleta 2"
    });
}

let missaoAtiva = false;
let pontosGanhos = 10;

function iniciarMissao() {

    if (missaoAtiva) {
        alert("Você já está em uma missão!");
        return;
    }

    missaoAtiva = true;

    alert("Missão iniciada! Vá até o ponto de coleta e confirme o descarte.");

}

function concluirMissao() {

    if (!missaoAtiva) {
        alert("Nenhuma missão ativa!");
        return;
    }

    missaoAtiva = false;

    let user = JSON.parse(localStorage.getItem("usuario"));

    user.pontos += pontosGanhos;

    localStorage.setItem("usuario", JSON.stringify(user));

    document.getElementById("userPoints").innerText = user.pontos;

    alert(`Missão concluída! +${pontosGanhos} pontos`);

}