const db = require('./utils/db-connect');
const express = require('express');
const userRouter = require('./routers/userRouter');
const chatRouter = require('./routers/chatRouter');
const groupRouter = require('./routers/groupRouter');
require('dotenv').config();
const cors = require('cors');
require('./models');
const app=express();
app.use(express.static('public'))

app.use(cors());
app.use(express.json());

app.use('/user',userRouter);
app.use('/chat',chatRouter);
app.use('/',groupRouter);


db.sync({force:false}).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('groupchat app running on port 5000');
    })
})
