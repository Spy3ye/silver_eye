import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Story = sequelize.define(
  'Story',
  {
    storyNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    storyScript: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    challengeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    chapterId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'stories'
  }
);

export default Story;

