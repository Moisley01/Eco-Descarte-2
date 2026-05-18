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
// CRIAR MISSÃO
// ===============================
app.post('/missoes', (req, res) => {

    const {
    usuarioId,
    ponto,
    pontosBase,
    tipoLixo,
    quantidade
} = req.body;

    const sql = `
        INSERT INTO missoes
        (
            usuario_id,
            ponto_nome,
            latitude,
            longitude,
            status,
            pontos
        )
        VALUES (?, ?, ?, ?, 'pendente', ?)
    `;

    db.query(
        sql,
        [
            usuarioId,
            ponto.nome,
            ponto.latitude,
            ponto.longitude,
            pontosBase
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    error: 'Erro ao criar missão'
                });
            }

            res.json({
                success: true,
                missaoId: result.insertId
            });
        }
    );
});


// ===============================
// CONCLUIR MISSÃO
// ===============================
app.put('/missoes/:id/concluir', (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE missoes
        SET concluded_at = NOW()
        WHERE id = ?
    `;

    db.query(sql, [id], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            success: true,
            mensagem:
                'Missão enviada para análise do colaborador'
        });
    });
});


// ===============================
// LISTAR MISSÕES
// ===============================
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
// BUSCAR MISSÃO PENDENTE
// ===============================
app.get('/missoes/ativa/:usuarioId', (req, res) => {

    const usuarioId = req.params.usuarioId;

    const sql = `
        SELECT * FROM missoes
        WHERE usuario_id = ?
        AND status = 'pendente'
        LIMIT 1
    `;

    db.query(sql, [usuarioId], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.json(null);
        }

        res.json(result[0]);
    });
});


// ===============================
// BUSCAR USUÁRIO
// ===============================
app.get('/usuarios/:id', (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT * FROM usuarios
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {

            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        res.json(result[0]);
    });
});


// ===============================
// RESGATAR PRODUTO
// ===============================
app.post('/resgatar', (req, res) => {

    const { usuarioId, produtoId } = req.body;

    const sqlProduto = `
        SELECT * FROM produtos
        WHERE id = ?
    `;

    db.query(sqlProduto, [produtoId], (err, produtoResult) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (produtoResult.length === 0) {

            return res.status(404).json({
                success: false,
                mensagem: 'Produto não encontrado'
            });
        }

        const produto = produtoResult[0];

        const sqlUsuario = `
            SELECT * FROM usuarios
            WHERE id = ?
        `;

        db.query(sqlUsuario, [usuarioId], (err, usuarioResult) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (usuarioResult.length === 0) {

                return res.status(404).json({
                    success: false,
                    mensagem: 'Usuário não encontrado'
                });
            }

            const usuario = usuarioResult[0];

            // verificar pontos
            if (usuario.pontos < produto.preco) {

                return res.json({
                    success: false,
                    mensagem: 'Pontos insuficientes'
                });
            }

            // descontar pontos
            const sqlUpdate = `
                UPDATE usuarios
                SET pontos = pontos - ?
                WHERE id = ?
            `;

            db.query(
                sqlUpdate,
                [produto.preco, usuarioId],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    const codigo =
                        `ECO-${Math.floor(Math.random() * 100000)}`;

                    // salvar resgate
                    const sqlResgate = `
                        INSERT INTO resgates
                        (
                            usuario_id,
                            produto_id,
                            produto_nome,
                            pontos_gastos,
                            codigo
                        )
                        VALUES (?, ?, ?, ?, ?)
                    `;

                    db.query(
                        sqlResgate,
                        [
                            usuarioId,
                            produto.id,
                            produto.nome,
                            produto.preco,
                            codigo
                        ],
                        (err) => {

                            if (err) {
                                return res.status(500).json(err);
                            }

                            db.query(
                                sqlUsuario,
                                [usuarioId],
                                (err, usuarioAtualizado) => {

                                    if (err) {
                                        return res.status(500).json(err);
                                    }

                                    res.json({

                                        success: true,

                                        mensagem:
                                            'Produto resgatado com sucesso!',

                                        codigo,

                                        usuario:
                                            usuarioAtualizado[0]
                                    });
                                }
                            );
                        }
                    );
                }
            );
        });
    });
});


// ===============================
// LISTAR RESGATES DO USUÁRIO
// ===============================
app.get('/resgates/:usuarioId', (req, res) => {

    const usuarioId = req.params.usuarioId;

    const sql = `
        SELECT * FROM resgates
        WHERE usuario_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [usuarioId], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});


// ===============================
// LISTAR TODOS RESGATES
// ===============================
app.get('/resgates', (req, res) => {

    const sql = `
        SELECT * FROM resgates
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});


// ===============================
// APROVAR MISSÃO
// ===============================
app.put('/missoes/:id/aprovar', (req, res) => {

    const id = req.params.id;

    const sqlMissao = `
        SELECT * FROM missoes
        WHERE id = ?
    `;

    db.query(sqlMissao, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {

            return res.status(404).json({
                error: 'Missão não encontrada'
            });
        }

        const missao = result[0];

        // atualizar status
        const sqlUpdate = `
            UPDATE missoes
            SET status = 'aprovada'
            WHERE id = ?
        `;

        db.query(sqlUpdate, [id], (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            // adicionar pontos ao usuário
            const sqlUsuario = `
                UPDATE usuarios
                SET pontos = pontos + ?
                WHERE id = ?
            `;

            db.query(
                sqlUsuario,
                [missao.pontos, missao.usuario_id],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.json({
                        success: true,
                        mensagem: 'Missão aprovada'
                    });
                }
            );
        });
    });
});


// ===============================
// REJEITAR MISSÃO
// ===============================
app.put('/missoes/:id/rejeitar', (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE missoes
        SET status = 'rejeitada'
        WHERE id = ?
    `;

    db.query(sql, [id], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            success: true,
            mensagem: 'Missão rejeitada'
        });
    });
});


// ===============================
// INICIAR SERVIDOR
// ===============================
app.listen(3000, () => {

    console.log('Servidor rodando na porta 3000');
});