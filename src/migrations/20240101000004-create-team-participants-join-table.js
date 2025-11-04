/**
 * Migration: Create team_participants join table (many-to-many relationship)
 */

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('team_participants', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    team_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    participant_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'participants',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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

  // Add unique constraint to prevent duplicate team-participant pairs
  await queryInterface.addIndex('team_participants', ['team_id', 'participant_id'], {
    name: 'idx_team_participants_unique',
    unique: true
  });

  // Add indexes for better query performance
  await queryInterface.addIndex('team_participants', ['team_id'], {
    name: 'idx_team_participants_team_id'
  });

  await queryInterface.addIndex('team_participants', ['participant_id'], {
    name: 'idx_team_participants_participant_id'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('team_participants');
};

