import { Router } from 'express';
import { 
  getIntegrations, 
  getIntegrationById, 
  createIntegration, 
  updateIntegration, 
  deleteIntegration,
  testIntegrationAuth,
  oauthConnectConsumerApp,
  verifyRealGitHubAccount,
  verifyRealGoogleAccount
} from '../controllers/integrationsController';

const router = Router();

router.get('/', getIntegrations);
router.get('/:id', getIntegrationById);
router.post('/', createIntegration);
router.put('/:id', updateIntegration);
router.delete('/:id', deleteIntegration);
router.post('/auth/test', testIntegrationAuth);
router.post('/auth/oauth-connect', oauthConnectConsumerApp);
router.post('/auth/github/verify', verifyRealGitHubAccount);
router.post('/auth/google/verify', verifyRealGoogleAccount);

export default router;
