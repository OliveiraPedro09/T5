import { Request, Response } from 'express';
import database from '../database/database';

export class ConsumoController {
    // Registrar consumo de produto
    public async registrarConsumoProduto(req: Request, res: Response): Promise<void> {
        try {
            const { cliente_id, produto_id } = req.body;
            const db = database.getDatabase();

            // Verificar se cliente existe
            db.get('SELECT id FROM clientes WHERE id = ?', [cliente_id], (err, cliente) => {
                if (err) {
                    res.status(500).json({ error: 'Erro no banco de dados' });
                    return;
                }

                if (!cliente) {
                    res.status(404).json({ error: 'Cliente não encontrado' });
                    return;
                }

                // Verificar se produto existe
                db.get('SELECT id FROM produtos WHERE id = ?', [produto_id], (err, produto) => {
                    if (err) {
                        res.status(500).json({ error: 'Erro no banco de dados' });
                        return;
                    }

                    if (!produto) {
                        res.status(404).json({ error: 'Produto não encontrado' });
                        return;
                    }

                    // Registrar consumo
                    db.run(
                        'INSERT INTO consumo_produtos (cliente_id, produto_id) VALUES (?, ?)',
                        [cliente_id, produto_id],
                        function(err) {
                            if (err) {
                                res.status(500).json({ error: 'Erro ao registrar consumo' });
                                return;
                            }

                            res.status(201).json({ 
                                message: 'Consumo de produto registrado com sucesso', 
                                id: this.lastID 
                            });
                        }
                    );
                });
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Registrar consumo de serviço
    public async registrarConsumoServico(req: Request, res: Response): Promise<void> {
        try {
            const { cliente_id, servico_id } = req.body;
            const db = database.getDatabase();

            // Verificar se cliente existe
            db.get('SELECT id FROM clientes WHERE id = ?', [cliente_id], (err, cliente) => {
                if (err) {
                    res.status(500).json({ error: 'Erro no banco de dados' });
                    return;
                }

                if (!cliente) {
                    res.status(404).json({ error: 'Cliente não encontrado' });
                    return;
                }

                // Verificar se serviço existe
                db.get('SELECT id FROM servicos WHERE id = ?', [servico_id], (err, servico) => {
                    if (err) {
                        res.status(500).json({ error: 'Erro no banco de dados' });
                        return;
                    }

                    if (!servico) {
                        res.status(404).json({ error: 'Serviço não encontrado' });
                        return;
                    }

                    // Registrar consumo
                    db.run(
                        'INSERT INTO consumo_servicos (cliente_id, servico_id) VALUES (?, ?)',
                        [cliente_id, servico_id],
                        function(err) {
                            if (err) {
                                res.status(500).json({ error: 'Erro ao registrar consumo' });
                                return;
                            }

                            res.status(201).json({ 
                                message: 'Consumo de serviço registrado com sucesso', 
                                id: this.lastID 
                            });
                        }
                    );
                });
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Listar consumos de um cliente
    public async listarConsumosPorCliente(req: Request, res: Response): Promise<void> {
        try {
            const { cliente_id } = req.params;
            const db = database.getDatabase();

            // Buscar produtos consumidos
            db.all(`
                SELECT p.id, p.nome, p.preco, cp.data_consumo, 'produto' as tipo
                FROM produtos p
                INNER JOIN consumo_produtos cp ON p.id = cp.produto_id
                WHERE cp.cliente_id = ?
                ORDER BY cp.data_consumo DESC
            `, [cliente_id], (err, produtos) => {
                if (err) {
                    res.status(500).json({ error: 'Erro ao buscar consumos de produtos' });
                    return;
                }

                // Buscar serviços consumidos
                db.all(`
                    SELECT s.id, s.nome, s.preco, cs.data_consumo, 'servico' as tipo
                    FROM servicos s
                    INNER JOIN consumo_servicos cs ON s.id = cs.servico_id
                    WHERE cs.cliente_id = ?
                    ORDER BY cs.data_consumo DESC
                `, [cliente_id], (err, servicos) => {
                    if (err) {
                        res.status(500).json({ error: 'Erro ao buscar consumos de serviços' });
                        return;
                    }

                    const consumos = [...produtos, ...servicos].sort((a: any, b: any) => 
                        new Date(b.data_consumo).getTime() - new Date(a.data_consumo).getTime()
                    );

                    res.json(consumos);
                });
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Obter relatório de consumo
    public async relatorioConsumo(req: Request, res: Response): Promise<void> {
        try {
            const db = database.getDatabase();

            // Produtos mais consumidos
            db.all(`
                SELECT p.nome, COUNT(*) as quantidade, SUM(p.preco) as valor_total
                FROM produtos p
                INNER JOIN consumo_produtos cp ON p.id = cp.produto_id
                GROUP BY p.id, p.nome, p.preco
                ORDER BY quantidade DESC
            `, (err, produtosMaisConsumidos) => {
                if (err) {
                    res.status(500).json({ error: 'Erro ao buscar produtos mais consumidos' });
                    return;
                }

                // Serviços mais consumidos
                db.all(`
                    SELECT s.nome, COUNT(*) as quantidade, SUM(s.preco) as valor_total
                    FROM servicos s
                    INNER JOIN consumo_servicos cs ON s.id = cs.servico_id
                    GROUP BY s.id, s.nome, s.preco
                    ORDER BY quantidade DESC
                `, (err, servicosMaisConsumidos) => {
                    if (err) {
                        res.status(500).json({ error: 'Erro ao buscar serviços mais consumidos' });
                        return;
                    }

                    // Clientes que mais consomem
                    db.all(`
                        SELECT 
                            c.nome,
                            COUNT(DISTINCT cp.id) + COUNT(DISTINCT cs.id) as total_consumos,
                            COALESCE(SUM(p.preco), 0) + COALESCE(SUM(s.preco), 0) as valor_total
                        FROM clientes c
                        LEFT JOIN consumo_produtos cp ON c.id = cp.cliente_id
                        LEFT JOIN consumo_servicos cs ON c.id = cs.cliente_id
                        LEFT JOIN produtos p ON cp.produto_id = p.id
                        LEFT JOIN servicos s ON cs.servico_id = s.id
                        GROUP BY c.id, c.nome
                        HAVING total_consumos > 0
                        ORDER BY total_consumos DESC
                    `, (err, clientesQueConsomem) => {
                        if (err) {
                            res.status(500).json({ error: 'Erro ao buscar clientes que mais consomem' });
                            return;
                        }

                        res.json({
                            produtosMaisConsumidos,
                            servicosMaisConsumidos,
                            clientesQueConsomem
                        });
                    });
                });
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
