import { Router } from 'express';
import { createDeveloper, getDeveloperCredential, getDevelopers, getUsers, updateDeveloper, updateDeveloperStatus } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.get('/developers', getDevelopers);
router.post('/developers', createDeveloper);
router.put('/developers/:id', updateDeveloper);
router.patch('/developers/:id/status', updateDeveloperStatus);
router.get('/developers/:id/credential', getDeveloperCredential);

export default router;
