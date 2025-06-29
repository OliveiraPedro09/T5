import { Router } from 'express';
import { ServicoController } from '../controllers/servicoController';

const router = Router();
const servicoController = new ServicoController();

// Rotas para serviços
router.post('/', servicoController.criarServico);
router.get('/', servicoController.listarServicos);
router.get('/:id', servicoController.buscarServicoPorId);
router.put('/:id', servicoController.atualizarServico);
router.delete('/:id', servicoController.deletarServico);

export default router;
