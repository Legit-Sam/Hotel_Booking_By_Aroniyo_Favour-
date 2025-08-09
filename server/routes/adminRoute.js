import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserPassword,
  resetUserPassword
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, adminOnly, createUser)
  .get(protect, adminOnly, getAllUsers);
  router.put('/:id/reset-password', protect, adminOnly, resetUserPassword);

router.route('/:id')
  .get(protect, adminOnly, getUserById)
  .put(protect, adminOnly, updateUser)
  .delete(protect, adminOnly, deleteUser);

router.put('/update-password', protect, updateUserPassword);

export default router;