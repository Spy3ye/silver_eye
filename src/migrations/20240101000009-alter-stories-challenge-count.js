export const up = async (queryInterface, Sequelize) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    const tableDescription = await queryInterface.describeTable('stories');

    if (tableDescription.challenges) {
      await queryInterface.removeColumn('stories', 'challenges', { transaction });
    }

    if (!tableDescription.challenge_count) {
      await queryInterface.addColumn(
        'stories',
        'challenge_count',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        { transaction }
      );
    }
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    const tableDescription = await queryInterface.describeTable('stories');

    if (tableDescription.challenge_count) {
      await queryInterface.removeColumn('stories', 'challenge_count', { transaction });
    }

    if (!tableDescription.challenges) {
      await queryInterface.addColumn(
        'stories',
        'challenges',
        {
          type: Sequelize.TEXT,
          allowNull: true
        },
        { transaction }
      );
    }
  });
};

