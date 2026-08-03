import { Router } from 'express';
import { 
  getMeetings, 
  getMeetingById, 
  createMeeting, 
  updateMeeting, 
  deleteMeeting 
} from '../controllers/meetingsController';

const router = Router();

router.get('/', getMeetings);
router.get('/:id', getMeetingById);
router.post('/', createMeeting);
router.put('/:id', updateMeeting);
router.delete('/:id', deleteMeeting);

export default router;
