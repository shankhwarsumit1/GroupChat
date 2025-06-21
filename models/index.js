const UserModel = require('./UserModel');
const ChatModel = require('./ChatModel');
const GroupModel = require('./groupModel');
const UserGroup = require('./UserGroup');

UserModel.belongsToMany(GroupModel,{
    through:UserGroup,
    foreignKey:'userid',
    otherKey:'groupid',
    as:'Groups'
});

GroupModel.belongsToMany(UserModel,{
    through:UserGroup,
    foreignKey:'groupid',
    otherKey:'userid',
    as:'Users'
})

GroupModel.hasMany(ChatModel,{foriegnKey:'groupId'});
ChatModel.belongsTo(GroupModel,{foreignKey:'groupId'});

UserModel.hasMany(ChatModel,{foreignKey:'userId'});
ChatModel.belongsTo(UserModel,{foreignKey:'userId'});



module.exports = {UserModel,ChatModel,GroupModel};