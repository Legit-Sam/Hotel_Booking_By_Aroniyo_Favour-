import { validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));
    return res.status(422).json({ errors: extractedErrors });
  }
  next();
};
