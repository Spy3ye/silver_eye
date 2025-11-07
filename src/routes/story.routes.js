import express from 'express';
import { body, param } from 'express-validator';
import {
  create,
  getAll,
  getById,
  update,
  remove
} from '../controllers/story.controller.js';
import { authenticateToken, authorize, requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Story:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         storyNumber:
 *           type: integer
 *           example: 1
 *         storyScript:
 *           type: string
 *           example: "Mission briefing for the first operation."
 *         chapterId:
 *           type: integer
 *           example: 1
 *         chapter:
 *           $ref: '#/components/schemas/Chapter'
 *         challengeCount:
 *           type: integer
 *           example: 2
 *         challenges:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Challenge'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateStoryRequest:
 *       type: object
 *       required:
 *         - storyNumber
 *         - storyScript
 *         - chapterId
 *       properties:
 *         storyNumber:
 *           type: integer
 *           example: 1
 *         storyScript:
 *           type: string
 *           example: "Detailed mission briefing"
 *         chapterId:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /api/stories:
 *   post:
 *     summary: Create a new story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     description: Admin can create a new story and assign it to a chapter.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStoryRequest'
 *     responses:
 *       201:
 *         description: Story created successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   get:
 *     summary: Get all stories
 *     tags: [Stories]
 *     description: Admin, author, and participant can view stories.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stories retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  '/',
  [
    body('storyNumber')
      .isInt({ min: 1 })
      .withMessage('Story number must be a positive integer'),
    body('storyScript')
      .trim()
      .notEmpty()
      .withMessage('Story script is required'),
    body('chapterId')
      .isInt({ min: 1 })
      .withMessage('Chapter ID must be a positive integer')
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
 * /api/stories/{id}:
 *   get:
 *     summary: Get story by ID
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     description: Admin, author, and participant can view story details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Story retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     summary: Update a story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     description: Admin can update a story.
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
 *             $ref: '#/components/schemas/CreateStoryRequest'
 *     responses:
 *       200:
 *         description: Story updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Delete a story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     description: Admin can delete a story.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Story deleted successfully
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
      .withMessage('Invalid story ID format')
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
      .withMessage('Invalid story ID format'),
    body('storyNumber')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Story number must be a positive integer'),
    body('storyScript')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Story script cannot be empty'),
    body('chapterId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Chapter ID must be a positive integer')
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
      .withMessage('Invalid story ID format')
  ],
  validate,
  authenticateToken,
  requireAdmin,
  remove
);

export default router;

