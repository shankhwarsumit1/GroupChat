const express = require('express');
const userController = require('../controllers/userController');
const userAuth = require('../middleware/authentication');

const router = express.Router();
router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.get('/getUserData',userAuth,userController.getUserData);

module.exports=router;