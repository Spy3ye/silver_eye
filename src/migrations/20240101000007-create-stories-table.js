export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('stories', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    story_number: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    story_script: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    challenge_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    chapter_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'chapters',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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

  await queryInterface.addIndex('stories', ['story_number'], {
    name: 'idx_stories_story_number'
  });

  await queryInterface.addIndex('stories', ['chapter_id'], {
    name: 'idx_stories_chapter_id'
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('stories');
};

