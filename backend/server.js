const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Terrestre123*',
    database: 'ecodescarte'
});

db.connect((err) => {

    if(err){
        console.log('Erro ao conectar ao MySQL');
        console.log(err);
        return;
    }

    console.log('MySQL conectado');
});

app.get('/produtos', (req, res) => {

    const sql = 'SELECT * FROM produtos';

    db.query(sql, (err, result) => {

        if(err){
            return res.status(500).json(err);
        }

        const produtos = result.map(produto => ({
            id: produto.id,
            name: produto.nome,
            price: produto.preco,
            image: produto.imagem
        }));

        res.json(produtos);
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});