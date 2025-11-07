import Chapter from '../models/Chapter.js';
import Story from '../models/Story.js';
import Challenge from '../models/Challenge.js';
import { Op } from 'sequelize';

// Ensure associations are registered
import '../models/index.js';

export const createChapter = async (data) => {
  const existing = await Chapter.findOne({
    where: {
      [Op.or]: [
        { chapterId: data.chapterId },
        { chapterNumber: data.chapterNumber }
      ]
    }
  });

  if (existing) {
    if (existing.chapterId === data.chapterId) {
      throw new Error('Chapter ID already exists');
    }
    if (existing.chapterNumber === data.chapterNumber) {
      throw new Error('Chapter number already exists');
    }
  }

  const chapter = await Chapter.create({
    chapterNumber: data.chapterNumber,
    chapterId: data.chapterId,
    chapterImage: data.chapterImage,
    chapterScript: data.chapterScript
  });

  return chapter.toJSON();
};

export const getAllChapters = async () => {
  const chapters = await Chapter.findAll({
    include: [
      {
        model: Story,
        as: 'stories',
        include: [
          {
            model: Challenge,
            as: 'challengeItems'
          }
        ]
      }
    ],
    order: [
      ['chapterNumber', 'ASC'],
      [{ model: Story, as: 'stories' }, 'storyNumber', 'ASC'],
      [
        { model: Story, as: 'stories' },
        { model: Challenge, as: 'challengeItems' },
        'challengeScore',
        'ASC'
      ]
    ]
  });

  return chapters.map((chapter) => formatChapter(chapter));
};

export const getChapterById = async (id) => {
  const chapter = await Chapter.findByPk(id, {
    include: [
      {
        model: Story,
        as: 'stories',
        include: [
          {
            model: Challenge,
            as: 'challengeItems'
          }
        ]
      }
    ],
    order: [
      [{ model: Story, as: 'stories' }, 'storyNumber', 'ASC'],
      [
        { model: Story, as: 'stories' },
        { model: Challenge, as: 'challengeItems' },
        'challengeScore',
        'ASC'
      ]
    ]
  });

  if (!chapter) {
    throw new Error('Chapter not found');
  }

  return formatChapter(chapter);
};

export const updateChapter = async (id, updates) => {
  const chapter = await Chapter.findByPk(id);

  if (!chapter) {
    throw new Error('Chapter not found');
  }

  if (updates.chapterId || updates.chapterNumber) {
    const existing = await Chapter.findOne({
      where: {
        id: { [Op.ne]: id },
        [Op.or]: [
          updates.chapterId ? { chapterId: updates.chapterId } : null,
          updates.chapterNumber ? { chapterNumber: updates.chapterNumber } : null
        ].filter(Boolean)
      }
    });

    if (existing) {
      if (updates.chapterId && existing.chapterId === updates.chapterId) {
        throw new Error('Chapter ID already exists');
      }
      if (updates.chapterNumber && existing.chapterNumber === updates.chapterNumber) {
        throw new Error('Chapter number already exists');
      }
    }
  }

  const allowedFields = ['chapterNumber', 'chapterId', 'chapterImage', 'chapterScript'];
  const fieldsToUpdate = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      fieldsToUpdate[field] = updates[field];
    }
  });

  await chapter.update(fieldsToUpdate);
  return await getChapterById(id);
};

export const deleteChapter = async (id) => {
  const chapter = await Chapter.findByPk(id);

  if (!chapter) {
    throw new Error('Chapter not found');
  }

  await chapter.destroy();
  return true;
};

const formatChapter = (chapterInstance) => {
  const data = chapterInstance.toJSON();

  if (data.stories) {
    data.stories = data.stories.map((story) => mapStory(story));
  }

  data.storyCount = data.stories ? data.stories.length : 0;
  return data;
};

const mapStory = (story) => {
  const challengeItems = story.challengeItems || [];

  const storyData = {
    ...story,
    challenges: challengeItems,
    challengeCount: challengeItems.length
  };

  delete storyData.challengeItems;
  return storyData;
};

