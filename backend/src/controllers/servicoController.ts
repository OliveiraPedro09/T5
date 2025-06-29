import { Request, Response } from 'express';
import database from '../database/database';

export class ServicoController {
    // Criar serviço
    public async criarServico(req: Request, res: Response): Promise<void> {
        try {
            const { nome, preco } = req.body;
            const db = database.getDatabase();

            db.run(
                'INSERT INTO servicos (nome, preco) VALUES (?, ?)',
                [nome, preco],
                function(err) {
                    if (err) {
                        res.status(500).json({ error: 'Erro ao criar serviço' });
                        return;
                    }

                    res.status(201).json({ 
                        message: 'Serviço criado com sucesso', 
                        id: this.lastID 
                    });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Listar todos os serviços
    public async listarServicos(req: Request, res: Response): Promise<void> {
        try {
            const db = database.getDatabase();

            db.all('SELECT * FROM servicos ORDER BY nome', (err, servicos) => {
                if (err) {
                    res.status(500).json({ error: 'Erro ao buscar serviços' });
                    return;
                }

                res.json(servicos);
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Buscar serviço por ID
    public async buscarServicoPorId(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const db = database.getDatabase();

            db.get('SELECT * FROM servicos WHERE id = ?', [id], (err, servico) => {
                if (err) {
                    res.status(500).json({ error: 'Erro ao buscar serviço' });
                    return;
                }

                if (!servico) {
                    res.status(404).json({ error: 'Serviço não encontrado' });
                    return;
                }

                res.json(servico);
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Atualizar serviço
    public async atualizarServico(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { nome, preco } = req.body;
            const db = database.getDatabase();

            db.run(
                'UPDATE servicos SET nome = ?, preco = ? WHERE id = ?',
                [nome, preco, id],
                function(err) {
                    if (err) {
                        res.status(500).json({ error: 'Erro ao atualizar serviço' });
                        return;
                    }

                    if (this.changes === 0) {
                        res.status(404).json({ error: 'Serviço não encontrado' });
                        return;
                    }

                    res.json({ message: 'Serviço atualizado com sucesso' });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Deletar serviço
    public async deletarServico(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const db = database.getDatabase();

            db.run('DELETE FROM servicos WHERE id = ?', [id], function(err) {
                if (err) {
                    res.status(500).json({ error: 'Erro ao deletar serviço' });
                    return;
                }

                if (this.changes === 0) {
                    res.status(404).json({ error: 'Serviço não encontrado' });
                    return;
                }

                res.json({ message: 'Serviço deletado com sucesso' });
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
