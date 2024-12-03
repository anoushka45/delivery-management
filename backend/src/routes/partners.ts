import { Router } from 'express';
import { getPartners, addPartner, updatePartner, deletePartner } from '../controllers/partnersController';

const router = Router();

router.get('/', getPartners);
router.post('/', addPartner);
router.put('/:id', updatePartner);
router.delete('/:id', deletePartner);

export default router;
