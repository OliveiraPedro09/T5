import sqlite3 from 'sqlite3';
import path from 'path';

const DATABASE_PATH = path.join(__dirname, '../../database.db');

export class Database {
    private db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database(DATABASE_PATH, (err) => {
            if (err) {
                console.error('Erro ao conectar com o banco de dados:', err.message);
            } else {
                console.log('Conectado ao banco de dados SQLite.');
                this.initializeTables();
            }
        });
    }

    private initializeTables(): void {
        // Tabela de clientes
        this.db.run(`
            CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                nomeSocial TEXT,
                genero TEXT,
                cpf TEXT UNIQUE NOT NULL,
                dataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabela de RGs
        this.db.run(`
            CREATE TABLE IF NOT EXISTS rgs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                numero TEXT NOT NULL,
                dataEmissao DATE NOT NULL,
                cliente_id INTEGER,
                FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE
            )
        `);

        // Tabela de telefones
        this.db.run(`
            CREATE TABLE IF NOT EXISTS telefones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ddd TEXT NOT NULL,
                numero TEXT NOT NULL,
                cliente_id INTEGER,
                FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE
            )
        `);

        // Tabela de produtos
        this.db.run(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                preco REAL NOT NULL
            )
        `);

        // Tabela de serviços
        this.db.run(`
            CREATE TABLE IF NOT EXISTS servicos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                preco REAL NOT NULL
            )
        `);

        // Tabela de consumo de produtos
        this.db.run(`
            CREATE TABLE IF NOT EXISTS consumo_produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente_id INTEGER,
                produto_id INTEGER,
                data_consumo DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE,
                FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE CASCADE
            )
        `);

        // Tabela de consumo de serviços
        this.db.run(`
            CREATE TABLE IF NOT EXISTS consumo_servicos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente_id INTEGER,
                servico_id INTEGER,
                data_consumo DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE,
                FOREIGN KEY (servico_id) REFERENCES servicos (id) ON DELETE CASCADE
            )
        `);
    }

    public getDatabase(): sqlite3.Database {
        return this.db;
    }

    public close(): void {
        this.db.close((err) => {
            if (err) {
                console.error('Erro ao fechar o banco de dados:', err.message);
            } else {
                console.log('Conexão com o banco de dados fechada.');
            }
        });
    }
}

export default new Database();
