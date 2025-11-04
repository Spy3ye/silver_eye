import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addParticipantToTeam,
  removeParticipantFromTeam
} from '../services/team.service.js';

/**
 * Create new team
 */
export const create = async (req, res, next) => {
  try {
    const team = await createTeam(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: { team }
    });
  } catch (error) {
    if (error.message === 'Team name already exists') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Get all teams
 */
export const getAll = async (req, res, next) => {
  try {
    const teams = await getAllTeams();
    res.json({
      success: true,
      message: 'Teams retrieved successfully',
      data: {
        teams,
        count: teams.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get team by ID
 */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const team = await getTeamById(id);
    res.json({
      success: true,
      message: 'Team retrieved successfully',
      data: { team }
    });
  } catch (error) {
    if (error.message === 'Team not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Update team
 */
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const team = await updateTeam(id, req.body);
    res.json({
      success: true,
      message: 'Team updated successfully',
      data: { team }
    });
  } catch (error) {
    if (error.message === 'Team not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Delete team
 */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteTeam(id);
    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Team not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Add participant to team
 */
export const addParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { participantId } = req.body;
    
    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required'
      });
    }

    await addParticipantToTeam(id, participantId);
    const team = await getTeamById(id);
    
    res.json({
      success: true,
      message: 'Participant added to team successfully',
      data: { team }
    });
  } catch (error) {
    if (error.message === 'Team not found' || error.message === 'Participant not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message === 'Participant is already in this team') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * Remove participant from team
 */
export const removeParticipant = async (req, res, next) => {
  try {
    const { id, participantId } = req.params;
    
    await removeParticipantFromTeam(id, participantId);
    const team = await getTeamById(id);
    
    res.json({
      success: true,
      message: 'Participant removed from team successfully',
      data: { team }
    });
  } catch (error) {
    if (error.message === 'Team not found' || error.message === 'Participant not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

