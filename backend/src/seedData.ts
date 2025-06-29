import database from './database/database';

export class PopularDados {
    private db = database.getDatabase();

    public async popularDadosIniciais(): Promise<void> {
        try {
            // Aguardar um pouco para garantir que as tabelas foram criadas
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Inserir alguns produtos
            const produtos = [
                { nome: 'Shampoo Premium', preco: 25.90 },
                { nome: 'Condicionador Hidratante', preco: 22.50 },
                { nome: 'Máscara Capilar', preco: 35.00 },
                { nome: 'Óleo Capilar', preco: 18.75 },
                { nome: 'Creme para Pentear', preco: 15.60 }
            ];

            for (const produto of produtos) {
                await new Promise<void>((resolve, reject) => {
                    this.db.run(
                        'INSERT OR IGNORE INTO produtos (nome, preco) VALUES (?, ?)',
                        [produto.nome, produto.preco],
                        function(err) {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
            }

            // Inserir alguns serviços
            const servicos = [
                { nome: 'Corte Feminino', preco: 45.00 },
                { nome: 'Corte Masculino', preco: 25.00 },
                { nome: 'Escova', preco: 35.00 },
                { nome: 'Progressiva', preco: 150.00 },
                { nome: 'Coloração', preco: 80.00 },
                { nome: 'Mechas', preco: 120.00 },
                { nome: 'Hidratação', preco: 40.00 },
                { nome: 'Manicure', preco: 20.00 },
                { nome: 'Pedicure', preco: 25.00 }
            ];

            for (const servico of servicos) {
                await new Promise<void>((resolve, reject) => {
                    this.db.run(
                        'INSERT OR IGNORE INTO servicos (nome, preco) VALUES (?, ?)',
                        [servico.nome, servico.preco],
                        function(err) {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
            }

            // Inserir alguns clientes
            const clientes = [
                {
                    nome: 'Maria Silva',
                    nomeSocial: 'Maria',
                    genero: 'Feminino',
                    cpf: '12345678901'
                },
                {
                    nome: 'João Santos',
                    nomeSocial: 'João',
                    genero: 'Masculino',
                    cpf: '98765432100'
                },
                {
                    nome: 'Ana Costa',
                    nomeSocial: 'Ana',
                    genero: 'Feminino',
                    cpf: '45612378909'
                }
            ];

            for (const cliente of clientes) {
                await new Promise<void>((resolve, reject) => {
                    this.db.run(
                        'INSERT OR IGNORE INTO clientes (nome, nomeSocial, genero, cpf) VALUES (?, ?, ?, ?)',
                        [cliente.nome, cliente.nomeSocial, cliente.genero, cliente.cpf],
                        function(err) {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
            }

            console.log('Dados iniciais populados com sucesso!');
        } catch (error) {
            console.error('Erro ao popular dados iniciais:', error);
        }
    }
}

// Executar quando o arquivo for chamado diretamente
if (require.main === module) {
    const popularDados = new PopularDados();
    popularDados.popularDadosIniciais().then(() => {
        setTimeout(() => {
            database.close();
            process.exit(0);
        }, 1000);
    });
}
