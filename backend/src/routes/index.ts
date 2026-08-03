import { Router } from 'express';
import aiRoutes from './ai.routes';
import dataRoutes from './data.routes';

const router = Router();

router.use('/ai', aiRoutes);
router.use('/data', dataRoutes);

export default router;
