import { Router } from 'express';
import { ClienteController } from '../controllers/clienteController';

const router = Router();
const clienteController = new ClienteController();

// Rotas para clientes
router.post('/', clienteController.criarCliente);
router.get('/', clienteController.listarClientes);
router.get('/:id', clienteController.buscarClientePorId);
router.put('/:id', clienteController.atualizarCliente);
router.delete('/:id', clienteController.deletarCliente);

export default router;
