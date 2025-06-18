const {DataTypes, STRING} = require('sequelize');
const sequelize = require('../utils/db-connect');

const ChatModel = sequelize.define('chats',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    message:{
      type:DataTypes.STRING,
      allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

module.exports = ChatModel;