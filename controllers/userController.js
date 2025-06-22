const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const UserGroup = require('../models/UserGroup');
const {
  validateSignupData
} = require('../utils/validator');
const signup = async (req, res) => {
  try {
    validateSignupData(req);
    const {
      name,
      email,
      phonenumber,
      password
    } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      phonenumber,
      password: hashpassword
    });

    res.status(201).json({
      success: true,
      res: 'signup successfull'
    });

  } catch (err) {
    console.log(err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        error: err.errors[0].message
      });
    }
    res.status(400).json({
      success: false,
      'error': err.message
    });
  }
}

const login = async (req, res) => {
  try {
    const {
      email,
      password: enteredPassword
    } = req.body;
    const user = await UserModel.findOne({
      where: {
        email: email
      }
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        'error': 'user not found'
      });
    }
    const isPasswordValid = await user.isPasswordValid(enteredPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        'error': 'user not authorized'
      });

    }

    const token = await user.getJWT();
    user.isOnline = '1';
    await user.save()
    res.status(200).json({
      success: 'true',
      res: 'user login successfull',
      'token': token
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      'error': err.message
    });
  }
}

const getUserData = async (req, res) => {
  try {
    const {
      id,
      name,
      email,
      phonenumber
    } = req.user;

    const userData = {
      id,
      name,
      email,
      phonenumber
    };

    res.status(201).json({
      success: true,
      res: userData
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      'error': err.message
    });

  }
}

const getAllUsersGroup = async (req, res) => {
  try {
    const {
      groupId
    } = req.params;
   
    if (!groupId) {
      return res.status(400).json({
        success: false,
        error: 'groupId is required'
      });
    }
     const users = await UserModel.findAll();
    const groupMembers = await UserGroup.findAll({
      where: { groupid: groupId },
      attributes: ['userid', 'isAdmin']
    });

    const memberMap = {};
    groupMembers.forEach(member => {
      memberMap[member.userid] = member.isAdmin;
    });

     const finalUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isMember: memberMap[user.id] !== undefined,
      isAdmin: memberMap[user.id] === true
    }));

    res.status(200).json({ success: true, res: finalUsers });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      'error': err.message
    });

  }
}

const getAllUsers = async (req, res) => {
  try {
   
     const users = await UserModel.findAll();
    res.status(200).json({ success: true, res: users });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      'error': err.message
    });

  }
}

module.exports = {
  signup,
  login,
  getUserData,
  getAllUsers,getAllUsersGroup
};