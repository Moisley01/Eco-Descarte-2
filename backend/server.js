const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// CONEXÃO MYSQL
// ===============================
const db = mysql.createConnection({
    host: 'autorack.proxy.rlwy.net',
    user: 'root',
    password: 'FsHdvIvzQdnETVdolCsWDocqhqvBsYtj',
    database: 'railway',
    port: 32555,
    connectTimeout: 60000
});

db.connect((err) => {

    if (err) {
        console.log('Erro ao conectar ao MySQL');
        console.log(err);
        return;
    }

    console.log('MySQL conectado');
});


// ===============================
// PRODUTOS
// ===============================
app.get('/produtos', (req, res) => {

    const sql = 'SELECT * FROM produtos';

    db.query(sql, (err, result) => {

        if (err) {
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


// ===============================
// LOGIN
// ===============================
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


// ===============================
// CADASTRO
// ===============================
app.post('/cadastro', (req, res) => {

    const { nome, email, senha } = req.body;

    const sqlVerifica = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(sqlVerifica, [email], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {

            return res.json({
                success: false,
                mensagem: 'Email já cadastrado'
            });
        }

        const sql = `
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [nome, email, senha], (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                mensagem: 'Usuário cadastrado com sucesso'
            });

        });

    });

});


// ===============================
// 🚀 MISSÕES (NOVO SISTEMA)
// ===============================


// CRIAR MISSÃO
app.post('/missoes', (req, res) => {

    const { usuarioId, ponto, pontosBase } = req.body;

    const sql = `
        INSERT INTO missoes
        (usuario_id, ponto_nome, latitude, longitude, status, pontos)
        VALUES (?, ?, ?, ?, 'ativa', ?)
    `;

    db.query(sql, [
        usuarioId,
        ponto.nome,
        ponto.latitude,
        ponto.longitude,
        pontosBase
    ], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Erro ao criar missão' });
        }

        res.json({
            success: true,
            missaoId: result.insertId
        });
    });
});


// CONCLUIR MISSÃO
app.put('/missoes/:id/concluir', (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE missoes
        SET status = 'concluida',
            concluded_at = NOW()
        WHERE id = ?
    `;

    db.query(sql, [id], (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Erro ao concluir missão' });
        }

        res.json({
            success: true,
            message: 'Missão concluída com sucesso'
        });
    });
});


// LISTAR MISSÕES (para futuro colaborador)
app.get('/missoes', (req, res) => {

    const sql = 'SELECT * FROM missoes';

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});


// ===============================
// INICIAR SERVIDOR
// ===============================
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});