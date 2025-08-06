import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // ✅ import cors
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ✅ CORS CONFIG
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // your frontend URL
  credentials: true, // allow cookies (very important for auth)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/hotels', hotelRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
