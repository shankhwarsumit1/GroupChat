const express = require('express');
const groupController = require('../controllers/groupController');
const userAuth = require('../middleware/authentication');

const router = express.Router();
router.post('/createGroup',userAuth,groupController.createGroup);
router.post('/addUser',userAuth,groupController.addUser); 
router.get('/getGroups',userAuth,groupController.getGroups);

module.exports = router;