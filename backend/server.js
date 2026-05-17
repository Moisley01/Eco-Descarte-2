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

app.post('/login', (req, res) => {

    const { email, senha } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';

    db.query(sql, [email, senha], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {

            res.json({
                success: true,
                usuario: result[0]
            });

        } else {

            res.json({
                success: false,
                mensagem: 'Email ou senha incorretos'
            });
        }
    });
});

app.post('/cadastro', (req, res) => {

    const { nome, email, senha } = req.body;

    const sqlVerifica = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(sqlVerifica, [email], (err, result) => {

        if(err){
            return res.status(500).json(err);
        }

        if(result.length > 0){

            return res.json({
                success: false,
                mensagem: 'Email já cadastrado'
            });

        }

        const sql = `
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [nome, email, senha], (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                mensagem: 'Usuário cadastrado com sucesso'
            });

        });

    });

});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});