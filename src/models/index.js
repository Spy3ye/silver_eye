import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

// Import models here
// import User from './User.js';

const db = {
  sequelize,
  Sequelize
};

// Initialize models
// db.User = User(sequelize, Sequelize.DataTypes);

// Define associations here
// db.User.associate(db);

export default db;

