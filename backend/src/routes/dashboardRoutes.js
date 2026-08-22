import { Router } from 'express';
import {
  getAdminDashboard,
  getDeveloperDashboard,
  getUserDashboard
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect);

router.get('/user', authorize('user'), getUserDashboard);
router.get('/developer', authorize('developer'), getDeveloperDashboard);
router.get('/admin', authorize('admin'), getAdminDashboard);

export default router;
