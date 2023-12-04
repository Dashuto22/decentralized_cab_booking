const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize.js'); // Adjust the path to your Sequelize instance

const Resumes = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  account_address: {
    type: DataTypes.STRING,
  },
  user_name: {
    type: DataTypes.STRING,
  },
  user_role: {
    type: DataTypes.INTEGER,
  },
  number_of_rides: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'users', // Specify the table name explicitly
  timestamps: false  // <-- Add this line
});

module.exports = Resumes;
