const JWT = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const SECRETKEY = 'sumit';

const authenticate =async (req,res,next)=>{
    try{
  const {token} = req.headers;
  if(!token){
    res.status(404).json({success:false,error:'token not found'});
  }
  const decode = await JWT.verify(token,SECRETKEY);
  const userId = decode.id;
  const user = await UserModel.findByPk(userId);
  req.user = user;
  next();  }
  catch(err){
    console.log(err);
    res.status(401).json({success:false,error:'user authentication error'})
  }
}

module.exports = authenticate;