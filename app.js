const db = require('./utils/db-connect');
const express = require('express');
const userRouter = require('./routers/userRouter');
const chatRouter = require('./routers/chatRouter');
const groupRouter = require('./routers/groupRouter');
const cors = require('cors');
const { FORCE } = require('sequelize/lib/index-hints');
require('./models');
const app=express();
app.use(cors({
    origin:'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(express.json());

app.use('/user',userRouter);
app.use('/chat',chatRouter);
app.use('/',groupRouter);


db.sync({force:false}).then(()=>{
    app.listen(5000,()=>{
        console.log('groupchat app running on port 5000');
    })
})
