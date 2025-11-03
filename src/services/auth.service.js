import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import Participant from '../models/Participant.js';

/**
 * Generate access token
 */
export const generateAccessToken = (participant) => {
  return jwt.sign(
    {
      id: participant.id,
      username: participant.username,
      email: participant.email,
      type: 'access'
    },
    config.jwt.secret,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'
    }
  );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (participant) => {
  return jwt.sign(
    {
      id: participant.id,
      username: participant.username,
      type: 'refresh'
    },
    config.jwt.secret,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
    }
  );
};

/**
 * Verify token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Login participant
 */
export const loginParticipant = async (username, password) => {
  // Find participant by username
  const participant = await Participant.findOne({
    where: { username }
  });

  if (!participant) {
    throw new Error('Invalid username or password');
  }

  // Check password
  const isPasswordValid = await participant.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid username or password');
  }

  // Generate tokens
  const accessToken = generateAccessToken(participant);
  const refreshToken = generateRefreshToken(participant);

  return {
    participant: participant.toJSON(),
    accessToken,
    refreshToken
  };
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Find participant
    const participant = await Participant.findByPk(decoded.id);
    
    if (!participant) {
      throw new Error('Participant not found');
    }

    // Generate new access token
    const accessToken = generateAccessToken(participant);

    return {
      accessToken
    };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Get participant by ID
 */
export const getParticipantById = async (id) => {
  const participant = await Participant.findByPk(id);
  if (!participant) {
    throw new Error('Participant not found');
  }
  return participant.toJSON();
};

