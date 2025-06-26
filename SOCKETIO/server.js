const {Server} = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://3.109.23.255/:5000",
        methods: ['GET', 'POST']
    }
});

const users = {};
io.on("connection", (socket) => {
    console.log('New client connected', socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) {
        users[userId] = socket.id;
        console.log("hello", users);
    }

    io.emit("getonline", Object.keys(users));
    
   socket.on("new-group-created",({groupId,groupName,members})=>{
    console.log('new group created',members);    
    members.forEach(memberId=>{
            const socketId = users[memberId];
            if(socketId){
                 io.to(socketId).emit("group-created-for-you",{
                    groupId,
                    groupName,
                    members
                 });
            }
          });
   });

   socket.on("send-group-message",(data)=>{

    const roomName = `group-${data.groupId}`;
        console.log(roomName);
    socket.to(roomName).emit("receive-message",data);
   });

   socket.on("user-removed-from-group",({groupId,userId})=>{
    const socketId = users[userId];
    if(socketId){
        io.to(socketId).emit("removed-from-group",{groupId});
    }
   });

   socket.on("user-added-to-group",({groupId,userId})=>{
    const socketId=users[userId];
    if(socketId){
        io.to(socketId).emit("added-to-group",{groupId});
    }
   });

   socket.on("user-made-admin",({groupId,userId})=>{
    const socketId = users[userId];
    if(socketId){
            io.to(socketId).emit("made-admin",{groupId});
    }
   });

   socket.on("join-group",({newGroupId,currentUser})=>{
    const roomName = `group-${newGroupId}`;
            console.log(typeof(newGroupId));
    socket.join(roomName);
    message=`${currentUser.name} has joined chat..`
 
    socket.to(roomName).emit("user-joined",{message,newGroupId});
   })

   socket.on("leave-group",({currentGroup,currentUser})=>{
    const roomName=`group-${currentGroup.id}`;
    socket.leave(roomName);
    const groupId = currentGroup.id;
    message=`${currentUser.name} has left the chat..`
    socket.to(roomName).emit("left-chat",{message,groupId});

   })

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
        delete users[userId]
        io.emit("getonline", Object.keys(users));
    })
});

//real time message
const getRecieverGroupSocketId = (receiverId) =>{
    return users[receiverId];
}



module.exports = {
    app,
    io,
    server,
    getRecieverGroupSocketId
};