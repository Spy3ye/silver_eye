/**
 * Migration: Create participants table
 */

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('participants', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    fullname: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    },
    phone_number: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    username: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    registration_number: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
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

  // Add indexes for better query performance
  await queryInterface.addIndex('participants', ['username'], {
    name: 'idx_participants_username',
    unique: true
  });

  await queryInterface.addIndex('participants', ['email'], {
    name: 'idx_participants_email',
    unique: true
  });

  await queryInterface.addIndex('participants', ['registration_number'], {
    name: 'idx_participants_registration_number',
    unique: true
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('participants');
};

