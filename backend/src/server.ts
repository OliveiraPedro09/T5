import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import clienteRoutes from './routes/clienteRoutes';
import produtoRoutes from './routes/produtoRoutes';
import servicoRoutes from './routes/servicoRoutes';
import consumoRoutes from './routes/consumoRoutes';
import database from './database/database';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use('/api/clientes', clienteRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/consumo', consumoRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Backend rodando com sucesso!', timestamp: new Date().toISOString() });
});

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Health check disponível em: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Encerrando servidor...');
    database.close();
    process.exit(0);
});

export default app;
