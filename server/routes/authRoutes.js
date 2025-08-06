import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from '../controllers/userController.js';

import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';
import { validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validateRegister, validateRequest, registerUser);
router.post('/login', validateLogin, validateRequest, loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);

export default router;
