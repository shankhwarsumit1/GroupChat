const express = require('express');
const chatController = require('../controllers/chatController');
const userAuth = require('../middleware/authentication');
const router = express.Router();

router.post('/send',userAuth,chatController.sendMessage);
router.get('/getAllChats',userAuth,chatController.getAllChats);


module.exports= router;