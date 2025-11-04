import {
  createParticipant,
  getAllParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant
} from '../services/participant.service.js';

/**
 * Create new participant
 */
export const create = async (req, res, next) => {
  try {
    const { teamId, ...participantData } = req.body;
    
    const participant = await createParticipant(participantData, teamId);
    
    res.status(201).json({
      success: true,
      message: 'Participant created successfully',
      data: { participant }
    });
  } catch (error) {
    if (error.message.includes('already exists') || error.message === 'Team not found') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Get all participants
 */
export const getAll = async (req, res, next) => {
  try {
    const participants = await getAllParticipants();
    
    res.json({
      success: true,
      message: 'Participants retrieved successfully',
      data: {
        participants,
        count: participants.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get participant by ID
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const participant = await getParticipantById(id);
    
    res.json({
      success: true,
      message: 'Participant retrieved successfully',
      data: { participant }
    });
  } catch (error) {
    if (error.message === 'Participant not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Update participant
 */
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teamId, ...participantData } = req.body;
    
    const participant = await updateParticipant(id, participantData, teamId);
    
    res.json({
      success: true,
      message: 'Participant updated successfully',
      data: { participant }
    });
  } catch (error) {
    if (error.message === 'Participant not found' || error.message === 'Team not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message.includes('already exists')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Delete participant
 */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteParticipant(id);
    
    res.json({
      success: true,
      message: 'Participant deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Participant not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

