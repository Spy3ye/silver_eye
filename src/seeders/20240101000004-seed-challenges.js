export const up = async (queryInterface, Sequelize) => {
  const now = new Date();

  const [storyRows] = await queryInterface.sequelize.query(
    'SELECT id, story_number FROM stories WHERE story_number IN (:storyNumbers)',
    {
      replacements: {
        storyNumbers: [1, 2, 3]
      },
      type: Sequelize.QueryTypes.SELECT
    }
  );

  const storyMap = Array.isArray(storyRows)
    ? storyRows.reduce((acc, story) => {
        acc[story.story_number] = story.id;
        return acc;
      }, {})
    : {};

  const challenges = [
    {
      flag: 'FLAG{INTRO_DECRYPT}',
      story_number: 1,
      story_id: storyMap[1],
      challenge_score: 100,
      created_at: now,
      updated_at: now
    },
    {
      flag: 'FLAG{DEVICE_BLUEPRINT}',
      story_number: 1,
      story_id: storyMap[1],
      challenge_score: 120,
      created_at: now,
      updated_at: now
    },
    {
      flag: 'FLAG{RECON_CAPTURE}',
      story_number: 2,
      story_id: storyMap[2],
      challenge_score: 150,
      created_at: now,
      updated_at: now
    },
    {
      flag: 'FLAG{FACILITY_ESCAPE}',
      story_number: 2,
      story_id: storyMap[2],
      challenge_score: 130,
      created_at: now,
      updated_at: now
    },
    {
      flag: 'FLAG{TEAM_RESOURCES}',
      story_number: 3,
      story_id: storyMap[3],
      challenge_score: 200,
      created_at: now,
      updated_at: now
    },
    {
      flag: 'FLAG{RECRUIT_SPECIALISTS}',
      story_number: 3,
      story_id: storyMap[3],
      challenge_score: 180,
      created_at: now,
      updated_at: now
    }
  ].filter(challenge => challenge.story_id);

  if (challenges.length > 0) {
    await queryInterface.bulkInsert('challenges', challenges, {});
  }

  if (storyRows.length > 0) {
    await queryInterface.sequelize.query(
      'UPDATE stories SET challenge_count = (SELECT COUNT(*) FROM challenges WHERE story_id = stories.id) WHERE id IN (:storyIds)',
      {
        replacements: { storyIds: storyRows.map((s) => s.id) },
        type: Sequelize.QueryTypes.UPDATE
      }
    );
  }
};

export const down = async (queryInterface) => {
  await queryInterface.bulkDelete('challenges', {
    flag: [
      'FLAG{INTRO_DECRYPT}',
      'FLAG{DEVICE_BLUEPRINT}',
      'FLAG{RECON_CAPTURE}',
      'FLAG{FACILITY_ESCAPE}',
      'FLAG{TEAM_RESOURCES}',
      'FLAG{RECRUIT_SPECIALISTS}'
    ]
  });
};

