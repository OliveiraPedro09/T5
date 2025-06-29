import { Request, Response } from 'express';
import database from '../database/database';
import { ClienteCompleto, RGData, TelefoneData, ProdutoData, ServicoData } from '../models/types';

export class ClienteController {
    // Criar cliente
    public async criarCliente(req: Request, res: Response): Promise<void> {
        try {
            const { nome, nomeSocial, genero, cpf, rgs, telefones } = req.body;

            const db = database.getDatabase();

            // Verificar se CPF já existe
            db.get('SELECT id FROM clientes WHERE cpf = ?', [cpf], (err, row) => {
                if (err) {
                    res.status(500).json({ error: 'Erro no banco de dados' });
                    return;
                }

                if (row) {
                    res.status(400).json({ error: 'CPF já cadastrado' });
                    return;
                }

                // Inserir cliente
                db.run(
                    'INSERT INTO clientes (nome, nomeSocial, genero, cpf) VALUES (?, ?, ?, ?)',
                    [nome, nomeSocial, genero, cpf],
                    function(err) {
                        if (err) {
                            res.status(500).json({ error: 'Erro ao criar cliente' });
                            return;
                        }

                        const clienteId = this.lastID;

                        // Inserir RGs se existirem
                        if (rgs && rgs.length > 0) {
                            const rgStmt = db.prepare('INSERT INTO rgs (numero, dataEmissao, cliente_id) VALUES (?, ?, ?)');
                            rgs.forEach((rg: RGData) => {
                                rgStmt.run([rg.numero, rg.dataEmissao, clienteId]);
                            });
                            rgStmt.finalize();
                        }

                        // Inserir telefones se existirem
                        if (telefones && telefones.length > 0) {
                            const telefoneStmt = db.prepare('INSERT INTO telefones (ddd, numero, cliente_id) VALUES (?, ?, ?)');
                            telefones.forEach((telefone: TelefoneData) => {
                                telefoneStmt.run([telefone.ddd, telefone.numero, clienteId]);
                            });
                            telefoneStmt.finalize();
                        }

                        res.status(201).json({ 
                            message: 'Cliente criado com sucesso', 
                            id: clienteId 
                        });
                    }
                );
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Listar todos os clientes
    public async listarClientes(req: Request, res: Response): Promise<void> {
        try {
            const db = database.getDatabase();

            db.all('SELECT * FROM clientes ORDER BY nome', (err, clientes) => {
                if (err) {
                    res.status(500).json({ error: 'Erro ao buscar clientes' });
                    return;
                }

                res.json(clientes);
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Buscar cliente por ID com detalhes completos
    public async buscarClientePorId(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const db = database.getDatabase();

            // Buscar cliente
            db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, cliente) => {
                if (err) {
                    res.status(500).json({ error: 'Erro ao buscar cliente' });
                    return;
                }

                if (!cliente) {
                    res.status(404).json({ error: 'Cliente não encontrado' });
                    return;
                }

                // Buscar RGs
                db.all('SELECT * FROM rgs WHERE cliente_id = ?', [id], (err, rgs) => {
                    if (err) {
                        res.status(500).json({ error: 'Erro ao buscar RGs' });
                        return;
                    }

                    // Buscar telefones
                    db.all('SELECT * FROM telefones WHERE cliente_id = ?', [id], (err, telefones) => {
                        if (err) {
                            res.status(500).json({ error: 'Erro ao buscar telefones' });
                            return;
                        }

                        // Buscar produtos consumidos
                        db.all(`
                            SELECT p.* FROM produtos p
                            INNER JOIN consumo_produtos cp ON p.id = cp.produto_id
                            WHERE cp.cliente_id = ?
                        `, [id], (err, produtos) => {
                            if (err) {
                                res.status(500).json({ error: 'Erro ao buscar produtos consumidos' });
                                return;
                            }

                            // Buscar serviços consumidos
                            db.all(`
                                SELECT s.* FROM servicos s
                                INNER JOIN consumo_servicos cs ON s.id = cs.servico_id
                                WHERE cs.cliente_id = ?
                            `, [id], (err, servicos) => {
                                if (err) {
                                    res.status(500).json({ error: 'Erro ao buscar serviços consumidos' });
                                    return;
                                }

                                const clienteCompleto: ClienteCompleto = {
                                    ...(cliente as ClienteCompleto),
                                    rgs: rgs as RGData[],
                                    telefones: telefones as TelefoneData[],
                                    produtosConsumidos: produtos as ProdutoData[],
                                    servicosConsumidos: servicos as ServicoData[]
                                };

                                res.json(clienteCompleto);
                            });
                        });
                    });
                });
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Atualizar cliente
    public async atualizarCliente(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { nome, nomeSocial, genero } = req.body;
            const db = database.getDatabase();

            db.run(
                'UPDATE clientes SET nome = ?, nomeSocial = ?, genero = ? WHERE id = ?',
                [nome, nomeSocial, genero, id],
                function(err) {
                    if (err) {
                        res.status(500).json({ error: 'Erro ao atualizar cliente' });
                        return;
                    }

                    if (this.changes === 0) {
                        res.status(404).json({ error: 'Cliente não encontrado' });
                        return;
                    }

                    res.json({ message: 'Cliente atualizado com sucesso' });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Deletar cliente
    public async deletarCliente(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const db = database.getDatabase();

            db.run('DELETE FROM clientes WHERE id = ?', [id], function(err) {
                if (err) {
                    res.status(500).json({ error: 'Erro ao deletar cliente' });
                    return;
                }

                if (this.changes === 0) {
                    res.status(404).json({ error: 'Cliente não encontrado' });
                    return;
                }

                res.json({ message: 'Cliente deletado com sucesso' });
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
