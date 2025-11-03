import express from 'express';
import authRoutes from './auth.routes.js';

const router = express.Router();

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get API information
 *     description: Returns API status and version information
 *     tags: [API]
 *     responses:
 *       200:
 *         description: API is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API is working
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
// Example route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    version: '1.0.0'
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Import other route modules here
// import userRoutes from './user.routes.js';
// router.use('/users', userRoutes);

export default router;

