const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/post', function (req, res) {
    console.log("HERE2")
    console.log(req.params)
    userController.createUser(req, res);
   });
router.get('/get', function (req, res) {
    console.log("HERE2")
    userController.getAllUsers(req, res);
   });


module.exports = router;