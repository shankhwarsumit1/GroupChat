const ChatModel = require('../models/ChatModel');
const {Op} = require('sequelize');

const sendMessage = async(req,res)=>{
    try{
       const {message} = req.body;
       const userName = req.user.name;
       if(!message){
        return res.status(400).json({success:false,error:'please write a message'});
       }
       const chatData = await ChatModel.create({message:message,userId:req.user.id,userName:userName});
       res.status(201).json({success:true,res:'successfully sent a message',chat:chatData});

    }
    catch(err){
         console.log(err);
         res.status(500).json({success:false,error:err.message});
    }
}

const getMessages = async(req,res)=>{
    try{  const {messageId} = req.params;
          let chats;       

          if(messageId==='undefined'){    
            console.log(chats);
         chats = await ChatModel.findAll({
             attributes:['id','message','userName'],
              order:[['id','desc']],
              limit:100,
             });
             console.log(chats);
          }
         else{        
          chats = await ChatModel.findAll({
            attributes:['id','message','userName'],
            where:{
                id:{ [Op.lte]:messageId } },
                order:[['id','desc']],
                limit:100
            })
         }
          if(chats.length===0){
           return  res.status(404).json({success:false,res:'no chats found'});
          }
          
        res.status(200).json({success:true,chats:chats.reverse()});

    }
    catch(err){
         console.log(err);
         res.status(500).json({success:false,error:err.message});
    }
}

module.exports = {sendMessage,getMessages};