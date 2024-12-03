import { Router } from 'express';
import { getAllOrders, createAndAssignOrder, updateOrderStatus } from '../controllers/ordersController';

const router = Router();

router.get('/', getAllOrders);
router.post('/assign', createAndAssignOrder);
router.put('/:id/status', updateOrderStatus);

export default router;
