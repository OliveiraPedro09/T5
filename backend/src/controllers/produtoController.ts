import { Request, Response } from 'express';
import database from '../database/database';

export class ProdutoController {
    // Criar produto
    public async criarProduto(req: Request, res: Response): Promise<void> {
        try {
            const { nome, preco } = req.body;
            const db = database.getDatabase();

            db.run(
                'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
                [nome, preco],
                function(err) {
                    if (err) {
                        res.status(500).json({ error: 'Erro ao criar produto' });
                        return;
                    }

                    res.status(201).json({ 
                        message: 'Produto criado com sucesso', 
                        id: this.lastID 
                    });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Listar todos os produtos
    public async listarProdutos(req: Request, res: Response): Promise<void> {
        try {
            const db = database.getDatabase();

            db.all('SELECT * FROM produtos ORDER BY nome', (err, produtos) => {
                if (err) {
                    res.status(500).json({ error: 'Erro ao buscar produtos' });
                    return;
                }

                res.json(produtos);
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Buscar produto por ID
    public async buscarProdutoPorId(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const db = database.getDatabase();

            db.get('SELECT * FROM produtos WHERE id = ?', [id], (err, produto) => {
                if (err) {
                    res.status(500).json({ error: 'Erro ao buscar produto' });
                    return;
                }

                if (!produto) {
                    res.status(404).json({ error: 'Produto não encontrado' });
                    return;
                }

                res.json(produto);
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Atualizar produto
    public async atualizarProduto(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { nome, preco } = req.body;
            const db = database.getDatabase();

            db.run(
                'UPDATE produtos SET nome = ?, preco = ? WHERE id = ?',
                [nome, preco, id],
                function(err) {
                    if (err) {
                        res.status(500).json({ error: 'Erro ao atualizar produto' });
                        return;
                    }

                    if (this.changes === 0) {
                        res.status(404).json({ error: 'Produto não encontrado' });
                        return;
                    }

                    res.json({ message: 'Produto atualizado com sucesso' });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Deletar produto
    public async deletarProduto(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const db = database.getDatabase();

            db.run('DELETE FROM produtos WHERE id = ?', [id], function(err) {
                if (err) {
                    res.status(500).json({ error: 'Erro ao deletar produto' });
                    return;
                }

                if (this.changes === 0) {
                    res.status(404).json({ error: 'Produto não encontrado' });
                    return;
                }

                res.json({ message: 'Produto deletado com sucesso' });
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
