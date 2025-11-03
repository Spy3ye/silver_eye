import express from 'express';

const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    version: '1.0.0'
  });
});

// Import other route modules here
// import userRoutes from './user.routes.js';
// router.use('/users', userRoutes);

export default router;

