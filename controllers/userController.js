const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const {validateSignupData} = require('../utils/validator');

const signup = async (req,res)=>{
       try{
         validateSignupData(req);
         const {name,email,phonenumber,password} = req.body;
         const hashpassword = await bcrypt.hash(password,10);
         const user = await UserModel.create({name,email,phonenumber,password:hashpassword});

         res.status(201).json({success:true,res:'signup successfull'});

    }
       catch(err){
        console.log(err);
      if (err.name==='SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, error: err.errors[0].message });
      }
        res.status(400).json({success:false,'error':err.message});
       }
}

const login = async(req,res)=>{
try{
    const {email,password:enteredPassword} = req.body;
    const user = await UserModel.findOne({where:{email:email}});
    if(!user){
     return  res.status(404).json({success:false,'error':'user not found'});
    }
    const isPasswordValid =await user.isPasswordValid(enteredPassword);
    if(!isPasswordValid){
      return  res.status(401).json({success:false,'error':'user not authorized'});

    }
    const token = await user.getJWT();
    res.status(200).json({success:'true',res:'user login successfull','token':token})
}
catch(err){
  res.status(400).json({success:false,'error':err.message});}
}

module.exports = {signup,login};