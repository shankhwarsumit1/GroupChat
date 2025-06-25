const db = require('./utils/db-connect');
const express = require('express');
const userRouter = require('./routers/userRouter');
const chatRouter = require('./routers/chatRouter');
const groupRouter = require('./routers/groupRouter');
const path = require('path')
const {app,io,server} = require('./SOCKETIO/server');
require('dotenv').config();
const cors = require('cors');
require('./models');
app.use(express.static(path.resolve('./public')))

app.use(cors());
app.use(express.json());

app.use('/user',userRouter);
app.use('/chat',chatRouter);
app.use('/',groupRouter);



db.sync({force:false}).then(()=>{
    server.listen(process.env.PORT,()=>{
        console.log('groupchat app running on port 5000');
    })
})
