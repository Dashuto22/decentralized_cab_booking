const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql', // Change this to your database type
  host: '127.0.0.1',
  username: 'root',
  password: 'abcde12345',
  database: 'drsa',
});

module.exports = sequelize;

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize({
//   dialect: 'mysql', // Change this to your database type
//   host: 'fresumesdb.cvqxsznp7bfn.us-east-2.rds.amazonaws.com',
//   username: 'admin',
//   password: 'Vf4SvjxAx7lHiEaSlhts',
//   database: 'fresumes',
//   port: 3306, // Default MySQL port; add this if needed
// });

