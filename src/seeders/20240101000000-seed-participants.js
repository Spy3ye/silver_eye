/**
 * Seeder: Seed participants table with pre-defined participants
 */

import bcrypt from 'bcryptjs';

export const up = async (queryInterface, Sequelize) => {
  // Hash passwords
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password456', 10);
  const hashedPassword3 = await bcrypt.hash('password789', 10);

  // Pre-defined participants
  // Note: Roles will be set in the database. Default is 'participant'
  const participants = [
    {
      fullname: 'John Doe',
      email: 'john.doe@example.com',
      phone_number: '+1234567890',
      username: 'johndoe',
      password: hashedPassword1,
      registration_number: 'REG-2024-001',
      role: 'participant', // Default role, can be changed in database
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      fullname: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone_number: '+1234567891',
      username: 'janesmith',
      password: hashedPassword2,
      registration_number: 'REG-2024-002',
      role: 'participant', // Default role, can be changed in database
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      fullname: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone_number: '+1234567892',
      username: 'bobjohnson',
      password: hashedPassword3,
      registration_number: 'REG-2024-003',
      role: 'participant', // Default role, can be changed in database
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  // Insert participants (only if they don't exist)
  for (const participant of participants) {
    const existing = await queryInterface.sequelize.query(
      `SELECT id FROM participants WHERE username = :username OR email = :email LIMIT 1`,
      {
        replacements: { username: participant.username, email: participant.email },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (existing.length === 0) {
      await queryInterface.bulkInsert('participants', [participant]);
      console.log(`✅ Seeded participant: ${participant.username}`);
    } else {
      console.log(`⏭️  Skipped participant: ${participant.username} (already exists)`);
    }
  }
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('participants', {
    username: ['johndoe', 'janesmith', 'bobjohnson']
  }, {});
};

