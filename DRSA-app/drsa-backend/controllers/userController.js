const Users = require('../models/users');



const createUser = async (req, res) => {
    const { accountAddress, userName, userRole, numberOfRides } = req.body;
    console.log("req body : ", req.body);
    try {
        const newUser = await Users.create({
            account_address: accountAddress,
            user_name: userName,
            user_role: userRole,
            number_of_rides: numberOfRides
          });
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
  const getAllUsers = async (req, res) => {
    try {
      const users = await Users.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports = {
    createUser,
    getAllUsers
    // other exported functions...
  };