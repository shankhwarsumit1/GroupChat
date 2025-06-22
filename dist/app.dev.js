"use strict";

var db = require('./utils/db-connect');

var express = require('express');

var userRouter = require('./routers/userRouter');

var chatRouter = require('./routers/chatRouter');

var groupRouter = require('./routers/groupRouter');

var cors = require('cors');

var _require = require('sequelize/lib/index-hints'),
    FORCE = _require.FORCE;

require('./models');

var app = express();
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use('/user', userRouter);
app.use('/chat', chatRouter);
app.use('/', groupRouter);
db.sync({
  force: true
}).then(function () {
  app.listen(5000, function () {
    console.log('groupchat app running on port 5000');
  });
});