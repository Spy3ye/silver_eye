export const up = async (queryInterface, Sequelize) => {
  const now = new Date();

  const [chapterRows] = await queryInterface.sequelize.query(
    'SELECT id, chapter_id FROM chapters WHERE chapter_id IN (:chapterIds)',
    {
      replacements: {
        chapterIds: ['CH-ALPHA', 'CH-BRAVO']
      },
      type: Sequelize.QueryTypes.SELECT
    }
  );

  const chapterMap = Array.isArray(chapterRows)
    ? chapterRows.reduce((acc, chapter) => {
        acc[chapter.chapter_id] = chapter.id;
        return acc;
      }, {})
    : {};

  const stories = [
    {
      story_number: 1,
      story_script: 'Story 1 introduces the mission briefing for Chapter Alpha.',
      challenge_count: 2,
      chapter_id: chapterMap['CH-ALPHA'],
      created_at: now,
      updated_at: now
    },
    {
      story_number: 2,
      story_script: 'Story 2 presents the reconnaissance sequence for Chapter Alpha.',
      challenge_count: 2,
      chapter_id: chapterMap['CH-ALPHA'],
      created_at: now,
      updated_at: now
    },
    {
      story_number: 3,
      story_script: 'Story 3 depicts the team assembly for Chapter Bravo.',
      challenge_count: 2,
      chapter_id: chapterMap['CH-BRAVO'],
      created_at: now,
      updated_at: now
    }
  ].filter(story => story.chapter_id);

  if (stories.length > 0) {
    await queryInterface.bulkInsert('stories', stories, {});
  }
};

export const down = async (queryInterface) => {
  await queryInterface.bulkDelete('stories', {
    story_number: [1, 2, 3]
  });
};

