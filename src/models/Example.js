import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Example = sequelize.define('Example', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'active'
  }
}, {
  tableName: 'examples',
  timestamps: true,
  underscored: true
});

export default Example;

