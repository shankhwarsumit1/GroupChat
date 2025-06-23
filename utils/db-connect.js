const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DBNAME,process.env.DBUSERNAME,process.env.DBPASSWORD,{
    host:process.env.DBHOST,
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