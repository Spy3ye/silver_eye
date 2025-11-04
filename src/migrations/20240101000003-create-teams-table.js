/**
 * Migration: Create teams table
 */

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('teams', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    team_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    },
    score: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    image: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    rank: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // Add indexes
  await queryInterface.addIndex('teams', ['team_name'], {
    name: 'idx_teams_team_name',
    unique: true
  });

  await queryInterface.addIndex('teams', ['score'], {
    name: 'idx_teams_score'
  });

  await queryInterface.addIndex('teams', ['rank'], {
    name: 'idx_teams_rank'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('teams');
};

