import { Router } from 'express';
import {
  assignIssue,
  createIssue,
  deleteIssue,
  getIssue,
  listIssues,
  updateIssue
} from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.route('/').get(listIssues).post(authorize('user'), createIssue);
router.put('/:id/assign', authorize('admin'), assignIssue);
router.route('/:id').get(getIssue).put(updateIssue).delete(deleteIssue);

export default router;
