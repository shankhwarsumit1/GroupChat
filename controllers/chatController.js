const ChatModel = require('../models/ChatModel');

const sendMessage = async(req,res)=>{
    try{
       const {message} = req.body;
       if(!message){
        res.status(400).json({success:false,error:'please write a message'});
       }
       const chatData = await ChatModel.create({message:message,userId:req.user.id});
       res.status(201).json({success:true,error:'successfully sent a message'});

    }
    catch(err){
         console.log(err);
         res.status(500).json({success:false,error:err.message});
    }
}


module.exports = {sendMessage};