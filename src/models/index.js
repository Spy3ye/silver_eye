import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

// Import models
import Participant from './Participant.js';

const db = {
  sequelize,
  Sequelize
};

// Initialize models
db.Participant = Participant;

// Define associations here (if needed)
// db.Participant.associate(db);

export default db;

