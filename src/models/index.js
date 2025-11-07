import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

// Import models
import Participant from './Participant.js';
import Team from './Team.js';
import Chapter from './Chapter.js';
import Story from './Story.js';
import Challenge from './Challenge.js';

const db = {
  sequelize,
  Sequelize
};

// Initialize models
db.Participant = Participant;
db.Team = Team;
db.Chapter = Chapter;
db.Story = Story;
db.Challenge = Challenge;

// Define associations
// Participant belongs to one Team (direct relationship via team_id)
Participant.belongsTo(Team, {
  foreignKey: 'teamId',
  as: 'team'
});

// Team has many Participants (one-to-many relationship)
Team.hasMany(Participant, {
  foreignKey: 'teamId',
  as: 'members'
});

// Also keep many-to-many relationship for flexibility (if needed)
// Participant belongs to many Teams (via join table)
Participant.belongsToMany(Team, {
  through: 'team_participants',
  foreignKey: 'participant_id',
  otherKey: 'team_id',
  as: 'teams'
});

// Team belongs to many Participants (via join table)
Team.belongsToMany(Participant, {
  through: 'team_participants',
  foreignKey: 'team_id',
  otherKey: 'participant_id',
  as: 'Participants'
});

// Chapters → Stories → Challenges associations
Chapter.hasMany(Story, {
  foreignKey: 'chapterId',
  as: 'stories'
});

Story.belongsTo(Chapter, {
  foreignKey: 'chapterId',
  as: 'chapter'
});

Story.hasMany(Challenge, {
  foreignKey: 'storyId',
  as: 'challengeItems'
});

Challenge.belongsTo(Story, {
  foreignKey: 'storyId',
  as: 'story'
});

export default db;

