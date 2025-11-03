import { loginParticipant, refreshAccessToken, getParticipantById } from '../services/auth.service.js';

/**
 * Login controller
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Login participant and get tokens
    const { participant, accessToken, refreshToken } = await loginParticipant(username, password);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        participant,
        accessToken
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

/**
 * Refresh token controller
 */
export const refresh = async (req, res, next) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Refresh access token
    const { accessToken } = await refreshAccessToken(refreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Token refresh failed'
    });
  }
};

/**
 * Logout controller
 */
export const logout = async (req, res) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.json({
    success: true,
    message: 'Logout successful'
  });
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const participant = await getParticipantById(req.user.id);
    
    res.json({
      success: true,
      data: {
        participant
      }
    });
  } catch (error) {
    next(error);
  }
};

