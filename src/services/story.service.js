import Story from '../models/Story.js';
import Chapter from '../models/Chapter.js';
import Challenge from '../models/Challenge.js';

// Ensure associations initialized
import '../models/index.js';

export const createStory = async (data) => {
  const chapter = await Chapter.findByPk(data.chapterId);

  if (!chapter) {
    throw new Error('Chapter not found');
  }

  const story = await Story.create({
    storyNumber: data.storyNumber,
    storyScript: data.storyScript,
    challengeCount: 0,
    chapterId: data.chapterId
  });

  return await getStoryById(story.id);
};

export const getAllStories = async () => {
  const stories = await Story.findAll({
    include: [
      {
        model: Chapter,
        as: 'chapter'
      },
      {
        model: Challenge,
        as: 'challengeItems'
      }
    ],
    order: [
      ['storyNumber', 'ASC'],
      [{ model: Challenge, as: 'challengeItems' }, 'challengeScore', 'ASC']
    ]
  });

  return stories.map((story) => formatStory(story));
};

export const getStoryById = async (id) => {
  const story = await Story.findByPk(id, {
    include: [
      {
        model: Chapter,
        as: 'chapter'
      },
      {
        model: Challenge,
        as: 'challengeItems'
      }
    ],
    order: [
      [{ model: Challenge, as: 'challengeItems' }, 'challengeScore', 'ASC']
    ]
  });

  if (!story) {
    throw new Error('Story not found');
  }

  return formatStory(story);
};

export const updateStory = async (id, updates) => {
  const story = await Story.findByPk(id);

  if (!story) {
    throw new Error('Story not found');
  }

  if (updates.chapterId) {
    const chapter = await Chapter.findByPk(updates.chapterId);
    if (!chapter) {
      throw new Error('Chapter not found');
    }
  }

  const allowedFields = ['storyNumber', 'storyScript', 'chapterId'];
  const fieldsToUpdate = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      fieldsToUpdate[field] = updates[field];
    }
  });

  await story.update(fieldsToUpdate);
  return await getStoryById(id);
};

export const deleteStory = async (id) => {
  const story = await Story.findByPk(id);

  if (!story) {
    throw new Error('Story not found');
  }

  await story.destroy();
  return true;
};

const formatStory = (storyInstance) => {
  const data = storyInstance.toJSON();
  const challenges = data.challengeItems || [];

  data.challengeCount = challenges.length;
  data.challenges = challenges;
  delete data.challengeItems;

  return data;
};

