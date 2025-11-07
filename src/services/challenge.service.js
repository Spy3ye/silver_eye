import Challenge from '../models/Challenge.js';
import Story from '../models/Story.js';

// Ensure associations initialized
import '../models/index.js';

export const createChallenge = async (data) => {
  const story = await Story.findByPk(data.storyId);

  if (!story) {
    throw new Error('Story not found');
  }

  const challenge = await Challenge.create({
    flag: data.flag,
    storyNumber: data.storyNumber || story.storyNumber,
    storyId: data.storyId,
    challengeScore: data.challengeScore ?? 0
  });

  await recalculateStoryChallengeCount(data.storyId);

  return await getChallengeById(challenge.id);
};

export const getAllChallenges = async () => {
  const challenges = await Challenge.findAll({
    include: [
      {
        model: Story,
        as: 'story'
      }
    ],
    order: [['challengeScore', 'DESC']]
  });

  return challenges.map((challenge) => challenge.toJSON());
};

export const getChallengeById = async (id) => {
  const challenge = await Challenge.findByPk(id, {
    include: [
      {
        model: Story,
        as: 'story'
      }
    ]
  });

  if (!challenge) {
    throw new Error('Challenge not found');
  }

  return challenge.toJSON();
};

export const updateChallenge = async (id, updates) => {
  const challenge = await Challenge.findByPk(id);

  if (!challenge) {
    throw new Error('Challenge not found');
  }

  let storyNumber = updates.storyNumber;
  const originalStoryId = challenge.storyId;

  if (updates.storyId) {
    const story = await Story.findByPk(updates.storyId);
    if (!story) {
      throw new Error('Story not found');
    }
    storyNumber = story.storyNumber;
  }

  const fieldsToUpdate = {};
  const allowedFields = ['flag', 'storyNumber', 'storyId', 'challengeScore'];

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      fieldsToUpdate[field] = updates[field];
    }
  });

  if (storyNumber !== undefined) {
    fieldsToUpdate.storyNumber = storyNumber;
  }

  await challenge.update(fieldsToUpdate);

  const newStoryId = fieldsToUpdate.storyId ?? originalStoryId;

  if (originalStoryId !== newStoryId) {
    await recalculateStoryChallengeCount(originalStoryId);
  }
  await recalculateStoryChallengeCount(newStoryId);

  return await getChallengeById(id);
};

export const deleteChallenge = async (id) => {
  const challenge = await Challenge.findByPk(id);

  if (!challenge) {
    throw new Error('Challenge not found');
  }

  const storyId = challenge.storyId;

  await challenge.destroy();
  await recalculateStoryChallengeCount(storyId);
  return true;
};

const recalculateStoryChallengeCount = async (storyId) => {
  if (!storyId) return;

  const count = await Challenge.count({ where: { storyId } });
  await Story.update({ challengeCount: count }, { where: { id: storyId } });
};

