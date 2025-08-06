import express from 'express';
import {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  getEnums,
  searchHotels,
} from '../controllers/hotelController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/multer.js';

const router = express.Router();

// Public routes
router.get('/', getAllHotels);
router.get('/enums', getEnums);
router.get('/search', searchHotels);
router.get('/:id', getHotelById);

// Protected admin routes with proper middleware order
router.post('/', 
  protect, 
  adminOnly, 
  uploadMultiple, 
  createHotel
);

router.put('/:id', 
  protect, 
  adminOnly, 
  uploadMultiple, 
  updateHotel
);

router.delete('/:id', 
  protect, 
  adminOnly, 
  deleteHotel
);

export default router;