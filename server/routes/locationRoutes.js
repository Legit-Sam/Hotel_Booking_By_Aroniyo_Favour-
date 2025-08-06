import express from 'express';
import {
  getStates,
  getCities,
  createOrUpdateLocation,
  getAllLocations,
  deleteCity
} from '../controllers/locationController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/states', getStates);
router.get('/cities', getCities);

// Admin protected routes
router.route('/')
  .post(protect, adminOnly, createOrUpdateLocation)
  .get(protect, adminOnly, getAllLocations);

router.delete('/city', protect, adminOnly, deleteCity);

export default router;