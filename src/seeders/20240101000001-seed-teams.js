/**
 * Seeder: Seed teams table with pre-defined teams
 */

export const up = async (queryInterface, Sequelize) => {
  // Create the "elec" team
  const teamData = {
    team_name: 'elec',
    score: 0, // Default score
    image: 'https://media.ouest-france.fr/v1/pictures/48468ac46f0513f549a5fa069393d610-2861966.jpg?width=1260&client_id=eds&sign=114425eb617292e131a7bc23ed85bb672940a74eaa45dee16feac07975a64d46',
    rank: null, // Rank will be calculated automatically based on score
    created_at: new Date(),
    updated_at: new Date()
  };

  // Check if team already exists
  const existing = await queryInterface.sequelize.query(
    `SELECT id FROM teams WHERE team_name = :teamName LIMIT 1`,
    {
      replacements: { teamName: teamData.team_name },
      type: Sequelize.QueryTypes.SELECT
    }
  );

  let teamId;

  if (existing.length === 0) {
    // Insert team
    await queryInterface.bulkInsert('teams', [teamData]);
    console.log(`✅ Seeded team: ${teamData.team_name}`);
    
    // Get the inserted team ID
    const [result] = await queryInterface.sequelize.query(
      `SELECT id FROM teams WHERE team_name = :teamName LIMIT 1`,
      {
        replacements: { teamName: teamData.team_name },
        type: Sequelize.QueryTypes.SELECT
      }
    );
    teamId = result.id;
  } else {
    teamId = existing[0].id;
    console.log(`⏭️  Skipped team: ${teamData.team_name} (already exists)`);
  }

  // Add participants with IDs 1 and 3 to the team
  const participantIds = [1, 3];

  for (const participantId of participantIds) {
    // Check if participant exists
    const participantExists = await queryInterface.sequelize.query(
      `SELECT id FROM participants WHERE id = :participantId LIMIT 1`,
      {
        replacements: { participantId },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (participantExists.length === 0) {
      console.log(`⚠️  Participant with ID ${participantId} not found, skipping...`);
      continue;
    }

    // Check if participant is already in the team
    const existingRelation = await queryInterface.sequelize.query(
      `SELECT id FROM team_participants WHERE team_id = :teamId AND participant_id = :participantId LIMIT 1`,
      {
        replacements: { teamId, participantId },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (existingRelation.length === 0) {
      // Add to many-to-many join table
      await queryInterface.bulkInsert('team_participants', [{
        team_id: teamId,
        participant_id: participantId,
        created_at: new Date(),
        updated_at: new Date()
      }]);
      
      // Update participant's team_id field
      await queryInterface.sequelize.query(
        `UPDATE participants SET team_id = :teamId WHERE id = :participantId`,
        {
          replacements: { teamId, participantId },
          type: Sequelize.QueryTypes.UPDATE
        }
      );
      
      console.log(`✅ Added participant ${participantId} to team ${teamData.team_name}`);
    } else {
      // Update team_id even if already in join table
      await queryInterface.sequelize.query(
        `UPDATE participants SET team_id = :teamId WHERE id = :participantId`,
        {
          replacements: { teamId, participantId },
          type: Sequelize.QueryTypes.UPDATE
        }
      );
      console.log(`⏭️  Participant ${participantId} already in team ${teamData.team_name} (updated team_id)`);
    }
  }
};

export const down = async (queryInterface, Sequelize) => {
  // Remove team-participant relations
  await queryInterface.sequelize.query(
    `DELETE tp FROM team_participants tp
     INNER JOIN teams t ON tp.team_id = t.id
     WHERE t.team_name = 'elec'`,
    { type: Sequelize.QueryTypes.DELETE }
  );

  // Remove the team
  await queryInterface.bulkDelete('teams', {
    team_name: 'elec'
  }, {});
};

