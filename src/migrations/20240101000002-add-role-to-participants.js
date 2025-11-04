/**
 * Migration: Add role column to participants table
 */

export const up = async (queryInterface, Sequelize) => {
  // Add role column
  await queryInterface.addColumn('participants', 'role', {
    type: Sequelize.ENUM('admin', 'participant', 'author'),
    allowNull: false,
    defaultValue: 'participant',
    after: 'registration_number'
  });

  // Add index on role for better query performance
  await queryInterface.addIndex('participants', ['role'], {
    name: 'idx_participants_role'
  });
};

export const down = async (queryInterface, Sequelize) => {
  // Remove index
  await queryInterface.removeIndex('participants', 'idx_participants_role');
  
  // Remove role column
  await queryInterface.removeColumn('participants', 'role');
};

