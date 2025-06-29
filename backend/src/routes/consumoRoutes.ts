import { Router } from 'express';
import { ConsumoController } from '../controllers/consumoController';

const router = Router();
const consumoController = new ConsumoController();

// Rotas para consumo
router.post('/produto', consumoController.registrarConsumoProduto);
router.post('/servico', consumoController.registrarConsumoServico);
router.get('/cliente/:cliente_id', consumoController.listarConsumosPorCliente);
router.get('/relatorio', consumoController.relatorioConsumo);

export default router;
