import Participant from '../models/Participant.js';
import Team from '../models/Team.js';
import { Op } from 'sequelize';
// Import models index to initialize associations
import '../models/index.js';

/**
 * Create a new participant and assign to team
 */
export const createParticipant = async (participantData, teamId = null) => {
  // Check if username or email already exists
  const existing = await Participant.findOne({
    where: {
      [Op.or]: [
        { username: participantData.username },
        { email: participantData.email },
        { registrationNumber: participantData.registrationNumber }
      ]
    }
  });

  if (existing) {
    if (existing.username === participantData.username) {
      throw new Error('Username already exists');
    }
    if (existing.email === participantData.email) {
      throw new Error('Email already exists');
    }
    if (existing.registrationNumber === participantData.registrationNumber) {
      throw new Error('Registration number already exists');
    }
  }

  // If teamId is provided, verify team exists
  if (teamId) {
    const team = await Team.findByPk(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
  }

  // Create participant
  const participant = await Participant.create({
    fullname: participantData.fullname,
    email: participantData.email,
    phoneNumber: participantData.phoneNumber,
    username: participantData.username,
    password: participantData.password,
    registrationNumber: participantData.registrationNumber,
    role: participantData.role || 'participant',
    teamId: teamId || null
  });

  // If teamId provided, also add to many-to-many relationship
  if (teamId) {
    const team = await Team.findByPk(teamId);
    await team.addParticipant(participant);
  }

  return participant.toJSON();
};

/**
 * Get all participants
 */
export const getAllParticipants = async () => {
  const participants = await Participant.findAll({
    include: [
      {
        model: Team,
        as: 'team',
        attributes: ['id', 'teamName', 'score', 'image']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return participants.map(p => p.toJSON());
};

/**
 * Get participant by ID
 */
export const getParticipantById = async (id) => {
  const participant = await Participant.findByPk(id, {
    include: [
      {
        model: Team,
        as: 'team',
        attributes: ['id', 'teamName', 'score', 'image']
      }
    ]
  });

  if (!participant) {
    throw new Error('Participant not found');
  }

  return participant.toJSON();
};

/**
 * Update participant information
 */
export const updateParticipant = async (participantId, updateData, newTeamId = null) => {
  const participant = await Participant.findByPk(participantId);
  
  if (!participant) {
    throw new Error('Participant not found');
  }

  // Check for duplicate username, email, or registration number (excluding current participant)
  const duplicateConditions = [];
  if (updateData.username) {
    duplicateConditions.push({ username: updateData.username });
  }
  if (updateData.email) {
    duplicateConditions.push({ email: updateData.email });
  }
  if (updateData.registrationNumber) {
    duplicateConditions.push({ registrationNumber: updateData.registrationNumber });
  }

  if (duplicateConditions.length > 0) {
    const duplicateCheck = await Participant.findOne({
      where: {
        id: { [Op.ne]: participantId },
        [Op.or]: duplicateConditions
      }
    });

    if (duplicateCheck) {
      if (duplicateCheck.username === updateData.username) {
        throw new Error('Username already exists');
      }
      if (duplicateCheck.email === updateData.email) {
        throw new Error('Email already exists');
      }
      if (duplicateCheck.registrationNumber === updateData.registrationNumber) {
        throw new Error('Registration number already exists');
      }
    }
  }

  // If teamId is being updated, verify team exists
  if (newTeamId !== null && newTeamId !== undefined) {
    if (newTeamId !== 0 && newTeamId !== null) { // 0 or null means remove from team
      const team = await Team.findByPk(newTeamId);
      if (!team) {
        throw new Error('Team not found');
      }
    }
  }

  // Update allowed fields
  const allowedFields = ['fullname', 'email', 'phoneNumber', 'username', 'password', 'registrationNumber', 'role'];
  const fieldsToUpdate = {};
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      fieldsToUpdate[field] = updateData[field];
    }
  }

  // Handle team assignment
  const oldTeamId = participant.teamId;
  if (newTeamId !== null && newTeamId !== undefined) {
    if (newTeamId === 0 || newTeamId === null) {
      // Remove from team
      fieldsToUpdate.teamId = null;
      if (oldTeamId) {
        const oldTeam = await Team.findByPk(oldTeamId);
        if (oldTeam) {
          await oldTeam.removeParticipant(participant);
        }
      }
    } else {
      // Assign to new team
      fieldsToUpdate.teamId = newTeamId;
      
      // Remove from old team if exists and different
      if (oldTeamId && oldTeamId !== newTeamId) {
        const oldTeam = await Team.findByPk(oldTeamId);
        if (oldTeam) {
          await oldTeam.removeParticipant(participant);
        }
      }
      
      // Add to new team
      const newTeam = await Team.findByPk(newTeamId);
      const isInNewTeam = await newTeam.hasParticipant(participant);
      if (!isInNewTeam) {
        await newTeam.addParticipant(participant);
      }
    }
  }

  await participant.update(fieldsToUpdate);

  // Reload with team information
  await participant.reload({
    include: [
      {
        model: Team,
        as: 'team',
        attributes: ['id', 'teamName', 'score', 'image']
      }
    ]
  });

  return participant.toJSON();
};

/**
 * Delete participant
 */
export const deleteParticipant = async (participantId) => {
  const participant = await Participant.findByPk(participantId);
  
  if (!participant) {
    throw new Error('Participant not found');
  }

  // Remove from all teams before deleting
  const teams = await participant.getTeams();
  for (const team of teams) {
    await team.removeParticipant(participant);
  }

  await participant.destroy();
  return true;
};

