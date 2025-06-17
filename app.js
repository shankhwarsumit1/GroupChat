const db = require('./utils/db-connect');
const express = require('express');
const userRouter = require('./routers/userRouter');
const cors = require('cors');
const app=express();
app.use(cors({
    origin:'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(express.json());

app.use('/user',userRouter);
db.sync({force:false}).then(()=>{
    app.listen(5000,()=>{
        console.log('groupchat app running on port 5000');
    })
})
