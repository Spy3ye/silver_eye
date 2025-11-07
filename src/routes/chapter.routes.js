import express from 'express';
import { body, param } from 'express-validator';
import {
  create,
  getAll,
  getById,
  update,
  remove
} from '../controllers/chapter.controller.js';
import { authenticateToken, authorize, requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Chapter:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         chapterNumber:
 *           type: integer
 *           example: 1
 *         chapterId:
 *           type: string
 *           example: "CH-ALPHA"
 *         chapterImage:
 *           type: string
 *           format: uri
 *           example: "https://example.com/chapters/ch-alpha.jpg"
 *         chapterScript:
 *           type: string
 *           example: "Chapter Alpha introduces the narrative..."
 *         stories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Story'
 *         storyCount:
 *           type: integer
 *           example: 2
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateChapterRequest:
 *       type: object
 *       required:
 *         - chapterNumber
 *         - chapterId
 *         - chapterScript
 *       properties:
 *         chapterNumber:
 *           type: integer
 *           example: 1
 *         chapterId:
 *           type: string
 *           example: "CH-ALPHA"
 *         chapterImage:
 *           type: string
 *           format: uri
 *           example: "https://example.com/chapters/ch-alpha.jpg"
 *         chapterScript:
 *           type: string
 *           example: "Detailed script for chapter alpha"
 */

/**
 * @swagger
 * /api/chapters:
 *   post:
 *     summary: Create a new chapter
 *     tags: [Chapters]
 *     description: Admin can create a new chapter.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChapterRequest'
 *     responses:
 *       201:
 *         description: Chapter created successfully
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
 *                   example: Chapter created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chapter:
 *                       $ref: '#/components/schemas/Chapter'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   get:
 *     summary: Get all chapters
 *     tags: [Chapters]
 *     description: Admin, author, and participant can view all chapters.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chapters retrieved successfully
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
 *                   example: Chapters retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chapters:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Chapter'
 *                     count:
 *                       type: integer
 *                       example: 5
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  '/',
  [
    body('chapterNumber')
      .isInt({ min: 1 })
      .withMessage('Chapter number must be a positive integer'),
    body('chapterId')
      .trim()
      .notEmpty()
      .withMessage('Chapter ID is required')
      .isLength({ max: 100 })
      .withMessage('Chapter ID must be at most 100 characters'),
    body('chapterImage')
      .optional()
      .isURL()
      .withMessage('Chapter image must be a valid URL'),
    body('chapterScript')
      .trim()
      .notEmpty()
      .withMessage('Chapter script is required')
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
 * /api/chapters/{id}:
 *   get:
 *     summary: Get chapter by ID
 *     tags: [Chapters]
 *     description: Admin, author, and participant can view chapter details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chapter ID
 *     responses:
 *       200:
 *         description: Chapter retrieved successfully
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
 *                   example: Chapter retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chapter:
 *                       $ref: '#/components/schemas/Chapter'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     summary: Update chapter
 *     tags: [Chapters]
 *     description: Admin can update chapter information.
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/CreateChapterRequest'
 *     responses:
 *       200:
 *         description: Chapter updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Delete chapter
 *     tags: [Chapters]
 *     description: Admin can delete a chapter.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chapter deleted successfully
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
      .withMessage('Invalid chapter ID format')
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
      .withMessage('Invalid chapter ID format'),
    body('chapterNumber')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Chapter number must be a positive integer'),
    body('chapterId')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Chapter ID must be at most 100 characters'),
    body('chapterImage')
      .optional()
      .isURL()
      .withMessage('Chapter image must be a valid URL'),
    body('chapterScript')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Chapter script cannot be empty')
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
      .withMessage('Invalid chapter ID format')
  ],
  validate,
  authenticateToken,
  requireAdmin,
  remove
);

export default router;

