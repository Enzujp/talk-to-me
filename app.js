const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server); // initialize socketio with server

const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");


// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());

// Use static files from public folder
app.use(express.static(path.join(__dirname, 'public')));


const adminName = 'Lord Enzu';

// Run when client connects, listen for connection  
io.on('connection', socket => { 
    // Join room
    socket.on('joinRoom', ({ username, room }) => {
     const user = userJoin(socket.id, username, room);   
    socket.join(user.room); // built-in room functionality


    
    // Welcome User, broadcasts to single user
    socket.emit('message', formatMessage(adminName, 'Welcome to talk to me!')); 

    // To Broadcast message on user's connection to everyone but the user
    //socket.broadcast.emit
    socket.broadcast.to(user.room).emit('message', formatMessage (adminName, `${user.username} has joined the chat`)); 

    // Users and room Info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    })
    
    });
        
    // io.emit(); // broadcasts to everyone in general
    
    
    // Listen for messages from chat
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg)); // emit to everyone
    })

    //Runs when client disconnects
    socket.on('disconnect', ()=> {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage( adminName, `${user.username} has left the chat`))
        }

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    });
    
})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(" this app runs on port 3000");
})


