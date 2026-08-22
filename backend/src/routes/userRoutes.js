import { Router } from 'express';
import { getDevelopers, getUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.get('/developers', getDevelopers);

export default router;
