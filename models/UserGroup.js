const {DataTypes} = require('sequelize');
const sequelize = require('../utils/db-connect');

const UserGroup = sequelize.define('usergroup',{
    groupid:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    userid:{
         type:DataTypes.INTEGER,
         allowNull:false
    },
    isAdmin:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})

module.exports=UserGroup;