import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Chapter = sequelize.define(
  'Chapter',
  {
    chapterNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    chapterId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    chapterImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    chapterScript: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: 'chapters'
  }
);

export default Chapter;

