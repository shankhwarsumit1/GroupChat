const GroupModel = require('../models/groupModel');
const UserModel = require('../models/UserModel');
const sequelize = require('../utils/db-connect');
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
            adminId:user.id,
            adminName:user.name
          },{transaction});
          await user.addGroup(group,{transaction});

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


module.exports = {createGroup,addUser,getGroups};