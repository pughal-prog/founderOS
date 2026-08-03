import { Router } from 'express';
import { getChatHistory, sendChatMessage, streamChatMessage, clearChatHistory } from '../controllers/chatController';

const router = Router();

router.get('/history', getChatHistory);
router.post('/', sendChatMessage);
router.post('/stream', streamChatMessage);
router.delete('/history', clearChatHistory);

export default router;
