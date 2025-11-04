import Team from '../models/Team.js';
import Participant from '../models/Participant.js';
import sequelize from '../config/database.js';
// Import models index to initialize associations
import '../models/index.js';

/**
 * Calculate rank based on score
 * Teams with higher scores get lower (better) ranks
 * Teams with same score get same rank (ties are handled)
 */
const calculateRank = (teams) => {
  // Convert to array and sort by score descending (highest score first)
  const teamsArray = Array.isArray(teams) ? teams : [teams];
  const sorted = teamsArray.map(team => {
    const teamData = team.toJSON ? team.toJSON() : team;
    return { ...teamData, originalTeam: team };
  }).sort((a, b) => {
    const scoreA = a.score || 0;
    const scoreB = b.score || 0;
    return scoreB - scoreA; // Descending order (higher score = better)
  });

  // Assign ranks
  let currentRank = 1;
  let previousScore = null;
  
  sorted.forEach((teamData, index) => {
    const currentScore = teamData.score || 0;
    
    // If score is different from previous, update rank
    if (previousScore !== null && currentScore !== previousScore) {
      currentRank = index + 1;
    } else if (previousScore === null) {
      // First team always gets rank 1
      currentRank = 1;
    }
    
    teamData.rank = currentRank;
    previousScore = currentScore;
    
    // Update the original team object if it exists
    if (teamData.originalTeam) {
      Object.assign(teamData.originalTeam, { rank: currentRank });
    }
  });

  return sorted.map(t => t.originalTeam || t);
};

/**
 * Get all teams with populated participant info
 */
export const getAllTeams = async () => {
  const teams = await Team.findAll({
    include: [
      {
        model: Participant,
        as: 'Participants',
        attributes: ['id', 'fullname', 'email', 'phoneNumber', 'username', 'registrationNumber'],
        through: { attributes: [] } // Exclude join table attributes
      }
    ],
    order: [
      ['score', 'DESC'] // Order by score descending (highest first)
    ]
  });

  // Calculate ranks based on score
  const rankedTeams = calculateRank(teams);

  // Add memberCount and rank to each team
  return rankedTeams.map(team => {
    const teamData = team.toJSON ? team.toJSON() : team;
    teamData.memberCount = teamData.Participants ? teamData.Participants.length : 0;
    // Rank is already calculated in calculateRank
    return teamData;
  });
};

/**
 * Get team by ID with populated participant info
 */
export const getTeamById = async (teamId) => {
  const team = await Team.findByPk(teamId, {
    include: [
      {
        model: Participant,
        as: 'Participants',
        attributes: ['id', 'fullname', 'email', 'phoneNumber', 'username', 'registrationNumber'],
        through: { attributes: [] }
      }
    ]
  });

  if (!team) {
    throw new Error('Team not found');
  }

  // Get all teams to calculate rank relative to others
  const allTeams = await Team.findAll({
    attributes: ['id', 'score'],
    order: [['score', 'DESC']]
  });

  // Calculate rank for this team
  const teamScore = team.score || 0;
  let rank = 1;
  let previousScore = null;
  
  // Find rank by counting teams with higher scores
  for (let i = 0; i < allTeams.length; i++) {
    const otherScore = allTeams[i].score || 0;
    
    if (allTeams[i].id === team.id) {
      // Found the team - rank is based on position
      rank = i + 1;
      // If previous teams have same score, share the rank
      if (previousScore !== null && previousScore === teamScore) {
        // Find the first team with this score
        for (let j = i - 1; j >= 0; j--) {
          if ((allTeams[j].score || 0) === teamScore) {
            rank = j + 1;
          } else {
            break;
          }
        }
      }
      break;
    }
    
    // Track previous score for tie handling
    if (otherScore > teamScore || (otherScore === teamScore && previousScore !== teamScore)) {
      previousScore = otherScore;
    }
  }

  const teamData = team.toJSON();
  teamData.memberCount = teamData.Participants ? teamData.Participants.length : 0;
  teamData.rank = rank;
  return teamData;
};

/**
 * Update team information
 */
export const updateTeam = async (teamId, updateData) => {
  const team = await Team.findByPk(teamId);
  
  if (!team) {
    throw new Error('Team not found');
  }

  // Update allowed fields (rank is calculated automatically, not updatable)
  const allowedFields = ['teamName', 'score', 'image'];
  const fieldsToUpdate = {};
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      fieldsToUpdate[field] = updateData[field];
    }
  }

  await team.update(fieldsToUpdate);

  // Reload with participants
  await team.reload({
    include: [
      {
        model: Participant,
        as: 'Participants',
        attributes: ['id', 'fullname', 'email', 'phoneNumber', 'username', 'registrationNumber'],
        through: { attributes: [] }
      }
    ]
  });

  // Calculate rank after update
  const allTeams = await Team.findAll({
    attributes: ['id', 'score'],
    order: [['score', 'DESC']]
  });

  const teamScore = team.score || 0;
  let rank = 1;
  
  // Find the team's position and calculate rank
  for (let i = 0; i < allTeams.length; i++) {
    if (allTeams[i].id === team.id) {
      rank = i + 1;
      // Handle ties - if previous teams have same score, share rank
      for (let j = i - 1; j >= 0; j--) {
        if ((allTeams[j].score || 0) === teamScore) {
          rank = j + 1;
        } else {
          break;
        }
      }
      break;
    }
  }

  const teamData = team.toJSON();
  teamData.memberCount = teamData.Participants ? teamData.Participants.length : 0;
  teamData.rank = rank;
  return teamData;
};

/**
 * Create new team
 */
export const createTeam = async (teamData) => {
  // Check if team name already exists
  const existing = await Team.findOne({
    where: { teamName: teamData.teamName }
  });

  if (existing) {
    throw new Error('Team name already exists');
  }

  // Create team
  const team = await Team.create({
    teamName: teamData.teamName,
    score: teamData.score || 0,
    image: teamData.image || null
  });

  // Reload with participants (empty initially)
  await team.reload({
    include: [
      {
        model: Participant,
        as: 'Participants',
        attributes: ['id', 'fullname', 'email', 'phoneNumber', 'username', 'registrationNumber'],
        through: { attributes: [] }
      }
    ]
  });

  // Calculate rank
  const allTeams = await Team.findAll({
    attributes: ['id', 'score'],
    order: [['score', 'DESC']]
  });

  const teamScore = team.score || 0;
  let rank = 1;
  
  for (let i = 0; i < allTeams.length; i++) {
    if (allTeams[i].id === team.id) {
      rank = i + 1;
      for (let j = i - 1; j >= 0; j--) {
        if ((allTeams[j].score || 0) === teamScore) {
          rank = j + 1;
        } else {
          break;
        }
      }
      break;
    }
  }

  const teamDataResult = team.toJSON();
  teamDataResult.memberCount = teamDataResult.Participants ? teamDataResult.Participants.length : 0;
  teamDataResult.rank = rank;
  return teamDataResult;
};

/**
 * Delete team
 */
export const deleteTeam = async (teamId) => {
  const team = await Team.findByPk(teamId);
  
  if (!team) {
    throw new Error('Team not found');
  }

  await team.destroy();
  return true;
};

/**
 * Add participant to team
 */
export const addParticipantToTeam = async (teamId, participantId) => {
  const team = await Team.findByPk(teamId);
  const participant = await Participant.findByPk(participantId);

  if (!team) {
    throw new Error('Team not found');
  }

  if (!participant) {
    throw new Error('Participant not found');
  }

  // Check if participant is already in the team
  const existing = await team.hasParticipant(participant);
  if (existing) {
    throw new Error('Participant is already in this team');
  }

  // Add to many-to-many relationship
  await team.addParticipant(participant);
  
  // Update participant's teamId field
  await participant.update({ teamId: teamId });
  
  return true;
};

/**
 * Remove participant from team
 */
export const removeParticipantFromTeam = async (teamId, participantId) => {
  const team = await Team.findByPk(teamId);
  const participant = await Participant.findByPk(participantId);

  if (!team) {
    throw new Error('Team not found');
  }

  if (!participant) {
    throw new Error('Participant not found');
  }

  // Remove from many-to-many relationship
  await team.removeParticipant(participant);
  
  // Clear participant's teamId if it was set to this team
  if (participant.teamId === teamId) {
    await participant.update({ teamId: null });
  }
  
  return true;
};

