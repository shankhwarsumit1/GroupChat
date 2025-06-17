const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('groupchatapp','root','your_new_password',{
    host:'localhost',
    dialect:'mysql'
});

(async()=>{
    try{
    await sequelize.authenticate();
    console.log('successfully connected to database');
    }
    catch(err){
        console.log(err);
    }
})();

module.exports=sequelize;