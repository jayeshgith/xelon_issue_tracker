import { Router } from 'express';
import {
  completePasswordReset,
  login,
  me,
  register,
  requestPasswordReset
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', completePasswordReset);

export default router;
