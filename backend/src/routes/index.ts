import { Router } from 'express';
import aiRoutes from './ai.routes';
import dataRoutes from './data.routes';
import chatRoutes from './chat.routes';
import dashboardRoutes from './dashboard.routes';
import customersRoutes from './customers.routes';
import tasksRoutes from './tasks.routes';
import meetingsRoutes from './meetings.routes';
import integrationsRoutes from './integrations.routes';

const router = Router();

// API Modules
router.use('/ai', aiRoutes);
router.use('/data', dataRoutes);
router.use('/chat', chatRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/customers', customersRoutes);
router.use('/tasks', tasksRoutes);
router.use('/meetings', meetingsRoutes);
router.use('/integrations', integrationsRoutes);

export default router;
