const sequelize = require('../utils/db-connect');
const {DataTypes} = require('sequelize');

const UserModel = sequelize.define('users', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            len:{args:[2,50],
                msg:'name must be between length 2 to 50',
            }
        }
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
           isEmail:{
            args:true,
            msg:'enter valid email'
           },
        },
        unique:true,
        set(value){
            this.setDataValue('email',value.trim().toLowerCase());
        }
    },
    phonenumber:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
           isNumeric:{
            msg:'phone number must be a numeric value'
           },
           len:{
            args: [10, 10],
            msg:'phone number must be exactly 10 digits',
           }
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            len:{
                args:[5,100],
                msg:'password length must be atleast 5'
            }
        }
    }
})

module.exports = UserModel;