const express = require('express');
const userController = require('../controllers/userController');
const groupController = require('../controllers/groupController');
const userAuth = require('../middleware/authentication');


const router = express.Router();
router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.get('/getUserData',userAuth,userController.getUserData);
router.get('/getAllUsers',userAuth,userController.getAllUsers);
module.exports=router;