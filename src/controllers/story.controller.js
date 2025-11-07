import {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory
} from '../services/story.service.js';

export const create = async (req, res, next) => {
  try {
    const story = await createStory(req.body);

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: { story }
    });
  } catch (error) {
    if (error.message === 'Chapter not found') {
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
    const stories = await getAllStories();

    res.json({
      success: true,
      message: 'Stories retrieved successfully',
      data: {
        stories,
        count: stories.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const story = await getStoryById(req.params.id);

    res.json({
      success: true,
      message: 'Story retrieved successfully',
      data: { story }
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

export const update = async (req, res, next) => {
  try {
    const story = await updateStory(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Story updated successfully',
      data: { story }
    });
  } catch (error) {
    if (error.message === 'Story not found' || error.message === 'Chapter not found') {
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
    await deleteStory(req.params.id);

    res.json({
      success: true,
      message: 'Story deleted successfully'
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

