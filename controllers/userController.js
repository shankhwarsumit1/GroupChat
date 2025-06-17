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

module.exports = {signup};