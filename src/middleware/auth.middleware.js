import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Verify it's an access token
    if (decoded.type !== 'access') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    req.user = decoded;
    next();
  });
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, config.jwt.secret, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

/**
 * Role-based authorization middleware
 * @param {string|string[]} allowedRoles - Single role or array of roles
 */
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // First check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Convert single role to array for consistent handling
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const userRole = req.user.role;

    // Check if user has required role
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = authorize('admin');

/**
 * Middleware to check if user is author
 */
export const requireAuthor = authorize('author');

/**
 * Middleware to check if user is participant
 */
export const requireParticipant = authorize('participant');

/**
 * Middleware to check if user is admin or author
 */
export const requireAdminOrAuthor = authorize(['admin', 'author']);

