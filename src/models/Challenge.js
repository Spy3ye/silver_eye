import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Challenge = sequelize.define(
  'Challenge',
  {
    flag: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    storyNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    challengeScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    storyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'challenges'
  }
);

export default Challenge;

