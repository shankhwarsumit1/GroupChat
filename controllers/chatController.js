const ChatModel = require('../models/ChatModel');

const sendMessage = async(req,res)=>{
    try{
       const {message} = req.body;
       const userName = req.user.name;
       if(!message){
        return res.status(400).json({success:false,error:'please write a message'});
       }
       const chatData = await ChatModel.create({message:message,userId:req.user.id,userName:userName});
       res.status(201).json({success:true,error:'successfully sent a message'});

    }
    catch(err){
         console.log(err);
         res.status(500).json({success:false,error:err.message});
    }
}

const getAllChats = async(req,res)=>{
    try{
          const chats = await ChatModel.findAll();
          if(chats.length===0){
           return  res.status(404).json({success:false,res:'no chats found'});
          }
        res.status(200).json({success:true,chats});

    }
    catch(err){
         console.log(err);
         res.status(500).json({success:false,error:err.message});
    }
}

module.exports = {sendMessage,getAllChats};