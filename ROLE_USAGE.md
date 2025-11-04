# Role-Based Access Control (RBAC) Usage Guide

## Overview

The system supports three roles:
- **admin**: Full administrative access
- **participant**: Regular participant access
- **author**: Content author access

## How Roles Work

### 1. Role Storage
- Roles are stored in the `participants` table in the database
- Role field is an ENUM: `admin`, `participant`, `author`
- Default role is `participant`

### 2. Role in JWT Tokens
- When a user logs in, their role is included in both access and refresh tokens
- The role is securely stored in the JWT payload
- Tokens are validated on every request

### 3. Setting Roles in Database
You can set roles directly in the database:

```sql
-- Set a user as admin
UPDATE participants SET role = 'admin' WHERE username = 'johndoe';

-- Set a user as author
UPDATE participants SET role = 'author' WHERE username = 'janesmith';

-- Set a user as participant (default)
UPDATE participants SET role = 'participant' WHERE username = 'bobjohnson';
```

## Using Role-Based Middleware

### Basic Usage

```javascript
import { authenticateToken, requireAdmin, requireAuthor, requireParticipant, authorize } from '../middleware/auth.middleware.js';

// Require admin role
router.get('/admin-only', authenticateToken, requireAdmin, adminController);

// Require author role
router.get('/author-only', authenticateToken, requireAuthor, authorController);

// Require participant role
router.get('/participant-only', authenticateToken, requireParticipant, participantController);

// Require multiple roles (admin OR author)
router.get('/admin-or-author', authenticateToken, requireAdminOrAuthor, controller);
```

### Custom Role Requirements

```javascript
import { authenticateToken, authorize } from '../middleware/auth.middleware.js';

// Require specific role
router.get('/custom', authenticateToken, authorize('admin'), controller);

// Require any of multiple roles
router.get('/multi-role', authenticateToken, authorize(['admin', 'author']), controller);
```

## Middleware Functions

### `authenticateToken`
- Validates JWT access token
- Adds user info to `req.user` (including role)
- Must be used before role-based middleware

### `authorize(roles)`
- Flexible middleware that accepts single role or array of roles
- Checks if user's role matches required role(s)
- Returns 403 if role doesn't match

### `requireAdmin`
- Shorthand for `authorize('admin')`
- Requires admin role

### `requireAuthor`
- Shorthand for `authorize('author')`
- Requires author role

### `requireParticipant`
- Shorthand for `authorize('participant')`
- Requires participant role

### `requireAdminOrAuthor`
- Shorthand for `authorize(['admin', 'author'])`
- Requires either admin or author role

## Example Route Implementation

```javascript
// src/routes/admin.routes.js
import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { getAllParticipants } from '../controllers/admin.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/admin/participants:
 *   get:
 *     summary: Get all participants (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of participants
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/participants', authenticateToken, requireAdmin, getAllParticipants);

export default router;
```

## Accessing User Role in Controllers

```javascript
// In your controller
export const myController = async (req, res) => {
  // User info is available in req.user after authenticateToken middleware
  const userId = req.user.id;
  const username = req.user.username;
  const role = req.user.role; // 'admin', 'participant', or 'author'
  
  // Use role for conditional logic
  if (req.user.role === 'admin') {
    // Admin-specific logic
  }
  
  res.json({ success: true, data: { userId, username, role } });
};
```

## Security Features

1. **Role in JWT**: Role is embedded in the token, so it can't be tampered with
2. **Token Validation**: Every request validates the token and checks the role
3. **Database Source of Truth**: Roles are stored in the database, not just in tokens
4. **Middleware Chain**: Authentication must come before authorization
5. **Error Handling**: Clear 403 Forbidden responses for unauthorized access

## Response Examples

### Successful Request (Authorized)
```json
{
  "success": true,
  "data": { ... }
}
```

### Unauthorized (No Token)
```json
{
  "success": false,
  "message": "Access token required"
}
```

### Forbidden (Insufficient Role)
```json
{
  "success": false,
  "message": "Access denied. Required role: admin"
}
```

## Best Practices

1. **Always use `authenticateToken` first**: This ensures the user is logged in
2. **Set roles in database**: Don't rely on tokens alone for role assignment
3. **Use middleware chain**: `authenticateToken` → `authorize(role)` → controller
4. **Validate roles**: The middleware automatically validates roles
5. **Document role requirements**: Add role requirements to Swagger docs

## Migration

The migration `20240101000002-add-role-to-participants.js` adds the role column to the participants table. Run migrations when you start the server, and they will execute automatically.

