import express from 'express';
import { body, param } from 'express-validator';
import {
  create,
  getAll,
  getById,
  update,
  remove
} from '../controllers/challenge.controller.js';
import { authenticateToken, authorize, requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Challenge:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 25
 *         flag:
 *           type: string
 *           example: "FLAG{MISSION_SUCCESS}"
 *         storyNumber:
 *           type: integer
 *           example: 1
 *         storyId:
 *           type: integer
 *           example: 10
 *         challengeScore:
 *           type: integer
 *           example: 100
 *         story:
 *           $ref: '#/components/schemas/Story'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateChallengeRequest:
 *       type: object
 *       required:
 *         - flag
 *         - storyId
 *       properties:
 *         flag:
 *           type: string
 *           example: "FLAG{MISSION_SUCCESS}"
 *         storyNumber:
 *           type: integer
 *           example: 1
 *           description: Optional. Defaults to linked story number if omitted.
 *         storyId:
 *           type: integer
 *           example: 10
 *         challengeScore:
 *           type: integer
 *           example: 150
 */

/**
 * @swagger
 * /api/challenges:
 *   post:
 *     summary: Create a new challenge
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     description: Admin can create a new challenge for a story.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChallengeRequest'
 *     responses:
 *       201:
 *         description: Challenge created successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   get:
 *     summary: Get all challenges
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     description: Admin, author, and participant can view challenges.
 *     responses:
 *       200:
 *         description: Challenges retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  '/',
  [
    body('flag')
      .trim()
      .notEmpty()
      .withMessage('Flag is required'),
    body('storyNumber')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Story number must be a positive integer'),
    body('storyId')
      .isInt({ min: 1 })
      .withMessage('Story ID must be a positive integer'),
    body('challengeScore')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Challenge score must be a non-negative integer')
  ],
  validate,
  authenticateToken,
  requireAdmin,
  create
);

router.get(
  '/',
  authenticateToken,
  authorize(['admin', 'author', 'participant']),
  getAll
);

/**
 * @swagger
 * /api/challenges/{id}:
 *   get:
 *     summary: Get challenge by ID
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     description: Admin, author, and participant can view challenge details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Challenge retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     summary: Update a challenge
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     description: Admin can update challenge details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChallengeRequest'
 *     responses:
 *       200:
 *         description: Challenge updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Delete a challenge
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     description: Admin can delete a challenge.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Challenge deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid challenge ID format')
  ],
  validate,
  authenticateToken,
  authorize(['admin', 'author', 'participant']),
  getById
);

router.put(
  '/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid challenge ID format'),
    body('flag')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Flag cannot be empty'),
    body('storyNumber')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Story number must be a positive integer'),
    body('storyId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Story ID must be a positive integer'),
    body('challengeScore')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Challenge score must be a non-negative integer')
  ],
  validate,
  authenticateToken,
  requireAdmin,
  update
);

router.delete(
  '/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Invalid challenge ID format')
  ],
  validate,
  authenticateToken,
  requireAdmin,
  remove
);

export default router;

