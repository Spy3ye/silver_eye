import express from 'express';
import { body, param } from 'express-validator';
import {
  create,
  getAll,
  getById,
  update,
  remove
} from '../controllers/participant.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateParticipantRequest:
 *       type: object
 *       required:
 *         - fullname
 *         - email
 *         - phoneNumber
 *         - username
 *         - password
 *         - registrationNumber
 *       properties:
 *         fullname:
 *           type: string
 *           example: "Alice Johnson"
 *         email:
 *           type: string
 *           format: email
 *           example: "alice.johnson@example.com"
 *         phoneNumber:
 *           type: string
 *           example: "+1234567893"
 *         username:
 *           type: string
 *           example: "alicejohnson"
 *         password:
 *           type: string
 *           format: password
 *           example: "password123"
 *         registrationNumber:
 *           type: string
 *           example: "REG-2024-004"
 *         role:
 *           type: string
 *           enum: [admin, participant, author]
 *           example: participant
 *         teamId:
 *           type: integer
 *           nullable: true
 *           example: 1
 *           description: ID of the team to assign the participant to
 */

/**
 * @swagger
 * /api/participants:
 *   post:
 *     summary: Create new participant
 *     description: Create a new participant and optionally assign to a team (Admin only)
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateParticipantRequest'
 *     responses:
 *       201:
 *         description: Participant created successfully
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
 *                   example: Participant created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     participant:
 *                       $ref: '#/components/schemas/Participant'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   get:
 *     summary: Get all participants
 *     description: Retrieve all participants with their team information (Admin only)
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Participants retrieved successfully
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
 *                   example: Participants retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     participants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Participant'
 *                     count:
 *                       type: integer
 *                       example: 10
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
  '/',
  [
    body('fullname')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 255 })
      .withMessage('Full name must be between 2 and 255 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('phoneNumber')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required'),
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Username must be between 3 and 100 characters'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('registrationNumber')
      .trim()
      .notEmpty()
      .withMessage('Registration number is required'),
    body('role')
      .optional()
      .isIn(['admin', 'participant', 'author'])
      .withMessage('Role must be admin, participant, or author'),
    body('teamId')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Team ID must be a positive integer')
  ],
  validate,
  authenticateToken,
  requireAdmin,
  create
);

router.get(
  '/',
  authenticateToken,
  requireAdmin,
  getAll
);

/**
 * @swagger
 * /api/participants/{id}:
 *   get:
 *     summary: Get participant by ID
 *     description: Retrieve a specific participant by ID with team information (All authenticated users)
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Participant ID
 *     responses:
 *       200:
 *         description: Participant retrieved successfully
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
 *                   example: Participant retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     participant:
 *                       $ref: '#/components/schemas/Participant'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get(
  '/:id',
  [
    param('id')
      .isInt()
      .withMessage('Invalid participant ID format')
  ],
  validate,
  authenticateToken,
  getById
);

/**
 * @swagger
 * /api/participants/{id}:
 *   put:
 *     summary: Update participant information
 *     description: Update participant information and optionally reassign to a team (Admin only)
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Participant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: "Alice Johnson Updated"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "alice.updated@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567894"
 *               username:
 *                 type: string
 *                 example: "aliceupdated"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "newpassword123"
 *               registrationNumber:
 *                 type: string
 *                 example: "REG-2024-004"
 *               role:
 *                 type: string
 *                 enum: [admin, participant, author]
 *                 example: participant
 *               teamId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *                 description: ID of the team to assign. Set to null or 0 to remove from team.
 *     responses:
 *       200:
 *         description: Participant updated successfully
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
 *                   example: Participant updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     participant:
 *                       $ref: '#/components/schemas/Participant'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Delete participant
 *     description: Delete a participant (Admin only). Participant will be removed from all teams.
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Participant ID
 *     responses:
 *       200:
 *         description: Participant deleted successfully
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
 *                   example: Participant deleted successfully
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
      .withMessage('Invalid participant ID format'),
    body('fullname')
      .optional()
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Full name must be between 2 and 255 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Invalid email format'),
    body('phoneNumber')
      .optional()
      .trim(),
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Username must be between 3 and 100 characters'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('registrationNumber')
      .optional()
      .trim(),
    body('role')
      .optional()
      .isIn(['admin', 'participant', 'author'])
      .withMessage('Role must be admin, participant, or author'),
    body('teamId')
      .optional()
      .custom((value) => {
        if (value === null || value === 0 || (typeof value === 'number' && value > 0)) {
          return true;
        }
        throw new Error('Team ID must be a positive integer, null, or 0');
      })
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
      .isInt()
      .withMessage('Invalid participant ID format')
  ],
  validate,
  authenticateToken,
  requireAdmin,
  remove
);

export default router;

