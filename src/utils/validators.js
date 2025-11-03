import { body, param, query } from 'express-validator';

// Example validators
export const validateExample = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
  ],

  update: [
    param('id')
      .isInt()
      .withMessage('Invalid ID format'),
    
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
  ],

  getById: [
    param('id')
      .isInt()
      .withMessage('Invalid ID format')
  ]
};

