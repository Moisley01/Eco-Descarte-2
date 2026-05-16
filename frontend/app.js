let icons = document.querySelector('.icons');
let body = document.querySelector('body');
let boxContainerHTML = document.querySelector('.box-container');

let boxContainer = [];

// Abrir/fechar carrinho
icons.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Adicionar produtos no HTML
const addDataToHTML = () => {

    boxContainerHTML.innerHTML = '';

    if (boxContainer.length > 0) {

        boxContainer.forEach(produto => {

            let newProduto = document.createElement('div');

            newProduto.classList.add('box');

            // Salvar id do produto
            newProduto.dataset.id = produto.id;

            newProduto.innerHTML = `
                <img src="${produto.image}" class="logo-item" alt="${produto.name}">

                <h3>${produto.name}</h3>

                <div class="price">${produto.price}pts</div>

                <button class="addCart">
                    Adicione ao Carrinho
                </button>
            `;

            boxContainerHTML.appendChild(newProduto);
        });
    }
};

// Evento do botão adicionar ao carrinho
boxContainerHTML.addEventListener('click', (event) => {

    let positionClick = event.target;

    if (positionClick.classList.contains('addCart')) {

        let produto_id = positionClick.parentElement.dataset.id;

        alert(`Produto ID: ${produto_id}`);
    }
});

// Buscar produtos da API
const initApp = () => {

    fetch('http://localhost:3000/produtos')

        .then(response => response.json())

        .then(data => {

            boxContainer = data;

            addDataToHTML();
        })

        .catch(error => {
            console.error('Erro ao buscar produtos:', error);
        });
};

initApp();