const express = require('express');
const groupController = require('../controllers/groupController');
const userAuth = require('../middleware/authentication');

const router = express.Router();
router.post('/createGroup',userAuth,groupController.createGroup);
router.post('/addUser',userAuth,groupController.addUser); 
router.get('/getGroups',userAuth,groupController.getGroups);
router.post('/makeAdmin',userAuth,groupController.makeAdmin);
router.get('/isUserAmin',userAuth,groupController.isUserAdmin);
router.delete('/removeuser',userAuth,groupController.removeUser);
module.exports = router;