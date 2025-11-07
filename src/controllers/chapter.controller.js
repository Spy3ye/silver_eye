import {
  createChapter,
  getAllChapters,
  getChapterById,
  updateChapter,
  deleteChapter
} from '../services/chapter.service.js';

export const create = async (req, res, next) => {
  try {
    const chapter = await createChapter(req.body);

    res.status(201).json({
      success: true,
      message: 'Chapter created successfully',
      data: { chapter }
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const chapters = await getAllChapters();

    res.json({
      success: true,
      message: 'Chapters retrieved successfully',
      data: {
        chapters,
        count: chapters.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const chapter = await getChapterById(req.params.id);

    res.json({
      success: true,
      message: 'Chapter retrieved successfully',
      data: { chapter }
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

export const update = async (req, res, next) => {
  try {
    const chapter = await updateChapter(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Chapter updated successfully',
      data: { chapter }
    });
  } catch (error) {
    if (error.message === 'Chapter not found') {
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

export const remove = async (req, res, next) => {
  try {
    await deleteChapter(req.params.id);

    res.json({
      success: true,
      message: 'Chapter deleted successfully'
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

