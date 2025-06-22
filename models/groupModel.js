const {DataTypes} = require('sequelize');
const sequelize = require('../utils/db-connect');

const GroupModel = sequelize.define('groups',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    groupName:{
         type:DataTypes.STRING,
         allowNull:false
    }
})

module.exports=GroupModel;