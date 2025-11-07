export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('challenges', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    flag: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    story_number: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    story_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'stories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    challenge_score: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  await queryInterface.addIndex('challenges', ['story_id'], {
    name: 'idx_challenges_story_id'
  });

  await queryInterface.addIndex('challenges', ['story_number'], {
    name: 'idx_challenges_story_number'
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('challenges');
};

