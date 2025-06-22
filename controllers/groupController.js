const GroupModel = require('../models/groupModel');
const UserModel = require('../models/UserModel');
const UserGroup = require('../models/UserGroup');
const sequelize = require('../utils/db-connect');
const { where } = require('sequelize');
const createGroup = async(req,res)=>{
    const transaction = await sequelize.transaction();
    try{  
          const {groupName,members} = req.body;
          const user = req.user;
          if(!groupName){
          return res.status(400).json({success:false,message:'plz provide a groupName'});
          }
         
          if(!Array.isArray(members)){
           return res.status(400).json({ success: false, message: 'Members must be an array of user IDs' });

          }

          const group = await GroupModel.create({
            groupName,
          },{transaction});
           
         await UserGroup.create({
                   userid: user.id,
                   groupid: group.id,
                   isAdmin: true
                   }, { transaction });

          const uniqueMemberIds = members.filter(id=>id !==user.id);
          
          const usersToAdd = await UserModel.findAll({
            where:{id:uniqueMemberIds},
            transaction
          });
         
         await group.addUsers(usersToAdd,{transaction});
         await transaction.commit();
          res.status(201).json({success:true,group});
    }
    catch(err){
        console.log(err);
        await transaction.rollback();
        res.status(500).json({success:false,error:err.message});
    }
};

const addUser = async(req,res)=>{
   try{
        const {userId,groupId} = req.body;

        const group = await GroupModel.findByPk(groupId);
        const user = await UserModel.findByPk(userId);

        if(!group){
        return res.status(404).json({success:false,message:'not found'});
            }
        await user.addGroup(group);
        res.status(201).json({success:true,group});

   }
   catch(err){
    console.log(err);
    res.status(500).json({success:false,error:err.message})
   }
}

const getGroups = async(req,res)=>{
   try{
        user = req.user;
        if(!user){
           return res.status(404).json({ success: false, message: 'User not found' });
        }

        const groups = await user.getGroups();
        res.status(200).json({success:true,groups});
   }
   catch(err){
    console.log(err);
    res.status(500).json({success:false,error:err.message})
   }
}

const makeAdmin = async(req,res)=>{
  try{
       const {groupId,userId} = req.body;

       if(!groupId || !userId){
        return res.status(400).json({ success: false, message: 'invalid request'});
       }
       const result = await UserGroup.update(
        {isAdmin:true},
       { where:{userId:userId,groupId:groupId}});
       if(!result){
             return res.status(400).json({ success: false, message: 'invalid request'});
       }
       res.status(200).json({success:true,message:`made admin successfully`});
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false,error:err.message});
  }
}

const isUserAdmin = async(req,res)=>{
  try{
        const {userId,groupId}= req.query;
       if(!groupId || !userId){
        return res.status(400).json({ success: false, message: 'invalid request'});
       }

        const groupdata = await UserGroup.findOne({
          where:{userId,groupId}
        })
        if(!groupdata){
          return res.status(400).json({ success: false, message: 'data not found'});
        }

        const isUserAdmin = groupdata.isAdmin;
        res.status(200).json({success:true,isUserAdmin});

  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false,error:err.message});
  }
}

const removeUser = async(req,res)=>{
  try{
      const {userId,groupId} = req.query;
       if(!groupId || !userId){
        return res.status(400).json({ success: false, message: 'invalid request'});
       }
      const response = await UserGroup.destroy({
        where:{userId,groupId}
      })
       if(!response){
          return res.status(400).json({ success: false, message: 'data not found'});
        }
      res.status(200).json({success:true,message:'successfully removed the user'});

  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false,error:err.message});
  }
}

module.exports = {createGroup,addUser,getGroups,makeAdmin,isUserAdmin,removeUser};