const express = require('express');
require('dotenv').config;
const clc = require('cli-color');
const dbconnect = require('./Database/dbConnection');
const app = express();
const cors = require('cors');
const socket = require('socket.io');
const AuthRouter = require('./controllers/authController');
const MessageRouter = require('./controllers/messageController');

//Middlewares
app.use(cors());
app.use(express.json());

//Database Connection
dbconnect();

//Port 
const PORT = process.env.PORT || 8888;


// Base Routes for the controllers
app.use("/api/auth",AuthRouter);
app.use("/api/messages",MessageRouter);


// Running my Server for the on the specified port
const server = app.listen(PORT, ()=> console.log(`Server started on PORT ${PORT}`));

//Configuring the Socket IO
const io = socket(server,{
    cors: {
        origin : ["http://localhost:5500","http://127.0.0.1:5500","http://localhost:3000","https://neo-rover-frontend.vercel.app"],
        Credential : true,
    },
});
//

//to keep track of online users
//global.onlineUsers is a Map object that will store user IDs as keys and their corresponding socket IDs as values.
global.onlineUsers = new Map();

//when a new client connects to the server
io.on("connection", (socket) => {
    global.chatSocket = socket;

    //make the new added user to be online
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
      });

      // when someone sending message to someone else
    
      socket.on("send-msg", (data) => {
        // console.log(data);
              if (data.isGroup) {
          // Handle group message
          // console.log(`Group message to ${data.groupId}: ${data.msg}`);
          io.to(data.groupId).emit("msg-recieve", data.msg,data.username,data.timestamp);
        } else {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          // const date = new Date(data.updatedAt).toISOString().split("T")[0];
          socket.to(sendUserSocket).emit("msg-recieve", data.msg,data.username,data.timestamp);
        }
      }
      });
       // Join group
       //data.username
      socket.on("join-group", (groupId) => {
        socket.join(groupId);
      });
    });


