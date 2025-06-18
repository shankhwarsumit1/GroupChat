// const JWT = require('jsonwebtoken');
// const UserModel = require('../models/UserModel');
// const SECRETKEY = 'sumit';

// const authenticate =async (req,res,next)=>{
//     const {email,password} = req.body;
//     const user = await UserModel.findOne({where:{email:email}});

//     const token = JWT.sign({userId:user.id},SECRETKEY);

    
// }

// module.exports = authenticate;