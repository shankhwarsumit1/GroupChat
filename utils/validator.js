const validator = require('validator');

const validateSignupData = (req)=>{
        const {name,email,phonenumber,password} = req.body;
        if(!name || name.trim().length<2){
            throw new Error('Name is not valid');
        }
        else if(!validator.isEmail(email)){
            throw new Error('email is not valid');
        }
        else if(!phonenumber || phonenumber.length!=10){
            throw new Error('please enter valid mobile number');
        }
        else if(!validator.isStrongPassword(password))
        {
            throw new Error('please enter strong password');
        }
     
}

module.exports = {validateSignupData};