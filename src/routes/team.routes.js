import express from 'express';
import { body, param } from 'express-validator';
import {
  create,
  getAll,
  getById,
  update,
  remove,
  addParticipant,
  removeParticipant
} from '../controllers/team.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         teamName:
 *           type: string
 *           example: "Team Alpha"
 *         score:
 *           type: integer
 *           example: 150
 *         image:
 *           type: string
 *           format: uri
 *           example: "https://example.com/team-image.jpg"
 *         rank:
 *           type: integer
 *           example: 1
 *           description: Calculated automatically based on score (lower rank = higher score)
 *         memberCount:
 *           type: integer
 *           example: 5
 *         Participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Participant'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TeamUpdate:
 *       type: object
 *       properties:
 *         teamName:
 *           type: string
 *           example: "Team Alpha Updated"
 *         score:
 *           type: integer
 *           example: 200
 *         image:
 *           type: string
 *           format: uri
 *           example: "https://example.com/new-team-image.jpg"
 *     AddParticipantRequest:
 *       type: object
 *       required:
 *         - participantId
 *       properties:
 *         participantId:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create new team
 *     description: Create a new team (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamName
 *             properties:
 *               teamName:
 *                 type: string
 *                 example: "Team Beta"
 *               score:
 *                 type: integer
 *                 example: 0
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/team-image.jpg"
 *     responses:
 *       201:
 *         description: Team created successfully
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
 *                   example: Team created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     team:
 *                       $ref: '#/components/schemas/Team'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   get:
 *     summary: Get all teams
 *     description: Retrieve all teams with populated participant information
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
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
 *                   example: Teams retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     teams:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Team'
 *                     count:
 *                       type: integer
 *                       example: 5
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  '/',
  [
    body('teamName')
      .trim()
      .notEmpty()
      .withMessage('Team name is required')
      .isLength({ min: 2, max: 255 })
      .withMessage('Team name must be between 2 and 255 characters'),
    body('score')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Score must be a non-negative integer'),
    body('image')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL')
  ],
  validate,
  authenticateToken,
  requireAdmin,
  create
);

router.get(
  '/',
  authenticateToken,
  getAll
);

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Get team by ID
 *     description: Retrieve a specific team by ID with populated participant information (All authenticated users)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team retrieved successfully
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
 *                   example: Team retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     team:
 *                       $ref: '#/components/schemas/Team'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/:id',
  [
    param('id')
      .isInt()
      .withMessage('Invalid team ID format')
  ],
  validate,
  authenticateToken,
  getById
);

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Update team information
 *     description: Update team information (Admin only). Can update teamName, score, and image. Rank is calculated automatically based on score.
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamUpdate'
 *     responses:
 *       200:
 *         description: Team updated successfully
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
 *                   example: Team updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     team:
 *                       $ref: '#/components/schemas/Team'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put(
  '/:id',
  [
    param('id')
      .isInt()
      .withMessage('Invalid team ID format'),
    body('teamName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Team name must be between 2 and 255 characters'),
    body('score')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Score must be a non-negative integer'),
    body('image')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL'),
  ],
  validate,
  authenticateToken,
  requireAdmin,
  update
);

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Delete team
 *     description: Delete a team (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team deleted successfully
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
 *                   example: Team deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  '/:id',
  [
    param('id')
      .isInt()
      .withMessage('Invalid team ID format')
  ],
  validate,
  authenticateToken,
  requireAdmin,
  remove
);

/**
 * @swagger
 * /api/teams/{id}/participants:
 *   post:
 *     summary: Add participant to team
 *     description: Add a participant to a team (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddParticipantRequest'
 *     responses:
 *       200:
 *         description: Participant added to team successfully
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
 *                   example: Participant added to team successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     team:
 *                       $ref: '#/components/schemas/Team'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post(
  '/:id/participants',
  [
    param('id')
      .isInt()
      .withMessage('Invalid team ID format'),
    body('participantId')
      .isInt()
      .withMessage('Participant ID must be an integer')
  ],
  validate,
  authenticateToken,
  requireAdmin,
  addParticipant
);

/**
 * @swagger
 * /api/teams/{id}/participants/{participantId}:
 *   delete:
 *     summary: Remove participant from team
 *     description: Remove a participant from a team (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Team ID
 *       - in: path
 *         name: participantId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Participant ID
 *     responses:
 *       200:
 *         description: Participant removed from team successfully
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
 *                   example: Participant removed from team successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     team:
 *                       $ref: '#/components/schemas/Team'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete(
  '/:id/participants/:participantId',
  [
    param('id')
      .isInt()
      .withMessage('Invalid team ID format'),
    param('participantId')
      .isInt()
      .withMessage('Invalid participant ID format')
  ],
  validate,
  authenticateToken,
  requireAdmin,
  removeParticipant
);

export default router;

