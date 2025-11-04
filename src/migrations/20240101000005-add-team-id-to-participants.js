/**
 * Migration: Add team_id column to participants table
 */

export const up = async (queryInterface, Sequelize) => {
  // Add team_id column
  await queryInterface.addColumn('participants', 'team_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'teams',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    after: 'role'
  });

  // Add index on team_id for better query performance
  await queryInterface.addIndex('participants', ['team_id'], {
    name: 'idx_participants_team_id'
  });
};

export const down = async (queryInterface, Sequelize) => {
  // Remove index
  await queryInterface.removeIndex('participants', 'idx_participants_team_id');
  
  // Remove team_id column
  await queryInterface.removeColumn('participants', 'team_id');
};

