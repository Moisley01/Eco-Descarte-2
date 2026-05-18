const API = 'https://eco-descarte-2-production.up.railway.app';


// ===============================
// CARREGAR MISSÕES
// ===============================
async function carregarMissoes() {

    try {

        const resposta = await fetch(`${API}/missoes`);

        const missoes = await resposta.json();

        const container =
            document.getElementById("missoes");

        container.innerHTML = "";

        // pegar apenas pendentes
        const pendentes = missoes.filter(
            missao => missao.status === 'pendente'
        );

        if (pendentes.length === 0) {

            container.innerHTML =
                "<p>Nenhuma missão pendente.</p>";

            return;
        }

        pendentes.forEach(missao => {

            container.innerHTML += `

                <div class="card">

                    <h3>${missao.ponto_nome}</h3>

                    <p>
                        Usuário ID:
                        ${missao.usuario_id}
                    </p>

                    <p>
                        Status:
                        ${missao.status}
                    </p>

                    <p>
                        Pontos:
                        ${missao.pontos}
                    </p>

                    <button onclick="aprovarMissao(${missao.id})">
                        Aprovar
                    </button>

                    <button onclick="rejeitarMissao(${missao.id})">
                        Rejeitar
                    </button>

                </div>
            `;
        });

    } catch (erro) {

        console.log(erro);

        alert('Erro ao carregar missões');
    }
}


// ===============================
// CARREGAR RESGATES
// ===============================
async function carregarResgates() {

    try {

        const resposta = await fetch(`${API}/resgates`);

        const resgates = await resposta.json();

        const container =
            document.getElementById("resgates");

        container.innerHTML = "";

        if (resgates.length === 0) {

            container.innerHTML =
                "<p>Nenhum resgate encontrado.</p>";

            return;
        }

        resgates.forEach(resgate => {

            container.innerHTML += `

                <div class="card">

                    <h3>${resgate.produto_nome}</h3>

                    <p>
                        Usuário ID:
                        ${resgate.usuario_id}
                    </p>

                    <p>
                        Código:
                        <strong>
                            ${resgate.codigo}
                        </strong>
                    </p>

                    <p>
                        Pontos gastos:
                        ${resgate.pontos_gastos}
                    </p>

                </div>
            `;
        });

    } catch (erro) {

        console.log(erro);

        alert('Erro ao carregar resgates');
    }
}


// ===============================
// APROVAR MISSÃO
// ===============================
async function aprovarMissao(id) {

    try {

        const resposta = await fetch(

            `${API}/missoes/${id}/aprovar`,

            {
                method: 'PUT'
            }
        );

        const dados = await resposta.json();

        alert(dados.mensagem);

        carregarMissoes();

    } catch (erro) {

        console.log(erro);

        alert('Erro ao aprovar missão');
    }
}


// ===============================
// REJEITAR MISSÃO
// ===============================
async function rejeitarMissao(id) {

    try {

        const resposta = await fetch(

            `${API}/missoes/${id}/rejeitar`,

            {
                method: 'PUT'
            }
        );

        const dados = await resposta.json();

        alert(dados.mensagem);

        carregarMissoes();

    } catch (erro) {

        console.log(erro);

        alert('Erro ao rejeitar missão');
    }
}


// ===============================
// INICIAR
// ===============================
carregarMissoes();

carregarResgates();