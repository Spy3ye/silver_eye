export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('chapters', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    chapter_number: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    chapter_id: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    chapter_image: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    chapter_script: {
      type: Sequelize.TEXT,
      allowNull: false
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

  await queryInterface.addIndex('chapters', ['chapter_number'], {
    name: 'idx_chapters_chapter_number'
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('chapters');
};

