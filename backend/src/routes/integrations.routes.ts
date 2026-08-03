import { Router } from 'express';
import { 
  getIntegrations, 
  getIntegrationById, 
  createIntegration, 
  updateIntegration, 
  deleteIntegration 
} from '../controllers/integrationsController';

const router = Router();

router.get('/', getIntegrations);
router.get('/:id', getIntegrationById);
router.post('/', createIntegration);
router.put('/:id', updateIntegration);
router.delete('/:id', deleteIntegration);

export default router;
