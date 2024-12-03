import { Router } from 'express';
import { getAssignmentMetrics, runAssignment ,getAllAssignments, getPartnerOverview} from '../controllers/assignmentsController';

const router = Router();

router.get('/metrics', getAssignmentMetrics);
router.post('/run', runAssignment);
router.get('/', getAllAssignments);
router.get('/partners/overview', getPartnerOverview);

export default router;
