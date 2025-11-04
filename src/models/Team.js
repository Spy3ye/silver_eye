import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  teamName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrlOrEmpty(value) {
        if (value && value.trim() !== '') {
          const urlRegex = /^https?:\/\/.+/;
          if (!urlRegex.test(value)) {
            throw new Error('Image must be a valid URL');
          }
        }
      }
    }
  },
  rank: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  }
}, {
  tableName: 'teams',
  timestamps: true,
  underscored: true,
  hooks: {
    afterFind: async (teams) => {
      // Calculate member count if teams are loaded with members
      if (Array.isArray(teams)) {
        for (const team of teams) {
          if (team.Participants) {
            team.memberCount = team.Participants.length;
          }
        }
      } else if (teams && teams.Participants) {
        teams.memberCount = teams.Participants.length;
      }
    }
  }
});

export default Team;

