import { body } from 'express-validator';

export const validateRegister = [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Valid email is required').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];

export const validateLogin = [
  body('email', 'Valid email is required').isEmail(),
  body('password', 'Password is required').notEmpty(),
];
