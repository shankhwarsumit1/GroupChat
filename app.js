const db = require('./utils/db-connect');
const express = require('express');
const userRouter = require('./routers/userRouter');
const app=express();
app.use(express.json());

app.use('/user',userRouter);
db.sync({force:true}).then(()=>{
    app.listen(5000,()=>{
        console.log('groupchat app running on port 5000');
    })
})
