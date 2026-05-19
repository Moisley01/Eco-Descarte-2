let boxContainerHTML =
    document.querySelector('.box-container');

let produtos = [];


// ===============================
// ADICIONAR PRODUTOS NO HTML
// ===============================
const addDataToHTML = () => {

    boxContainerHTML.innerHTML = '';

    if (produtos.length > 0) {

        produtos.forEach(produto => {

            let newProduto =
                document.createElement('div');

            newProduto.classList.add('box');

            newProduto.innerHTML = `

                <img
                    src="${produto.image}"
                    class="logo-item"
                    alt="${produto.name}"
                >

                <h3>${produto.name}</h3>

                <div class="price">
                    ${produto.price} pontos
                </div>

            `;

            boxContainerHTML.appendChild(newProduto);
        });
    }
};


// ===============================
// BUSCAR PRODUTOS DA API
// ===============================
const initApp = () => {

    fetch(
        'https://eco-descarte-2-production.up.railway.app/produtos'
    )

    .then(response => response.json())

    .then(data => {

        produtos = data;

        addDataToHTML();
    })

    .catch(error => {

        console.error(
            'Erro ao buscar produtos:',
            error
        );
    });
};


// ===============================
// INICIAR
// ===============================
initApp();