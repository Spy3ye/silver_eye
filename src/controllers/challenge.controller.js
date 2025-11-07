import {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge
} from '../services/challenge.service.js';

export const create = async (req, res, next) => {
  try {
    const challenge = await createChallenge(req.body);

    res.status(201).json({
      success: true,
      message: 'Challenge created successfully',
      data: { challenge }
    });
  } catch (error) {
    if (error.message === 'Story not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const challenges = await getAllChallenges();

    res.json({
      success: true,
      message: 'Challenges retrieved successfully',
      data: {
        challenges,
        count: challenges.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const challenge = await getChallengeById(req.params.id);

    res.json({
      success: true,
      message: 'Challenge retrieved successfully',
      data: { challenge }
    });
  } catch (error) {
    if (error.message === 'Challenge not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const challenge = await updateChallenge(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Challenge updated successfully',
      data: { challenge }
    });
  } catch (error) {
    if (error.message === 'Challenge not found' || error.message === 'Story not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteChallenge(req.params.id);

    res.json({
      success: true,
      message: 'Challenge deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Challenge not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

