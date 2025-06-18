const UserModel = require('./UserModel');
const ChatModel = require('./ChatModel');

UserModel.hasMany(ChatModel,{foreignKey:'userId'});
ChatModel.belongsTo(UserModel,{foreignKey:'userId'});

module.exports = {UserModel,ChatModel};