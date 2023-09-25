const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

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
    console.log("New websocket connection");

    // Welcome User, broadcasts to single user
    socket.emit('message', formatMessage(adminName, 'Welcome to talk to me!')); 

    // To Broadcast message on user's connection to everyone but the user
    socket.broadcast.emit('message', formatMessage (adminName, 'A User has joined the chat')); 

    // io.emit(); // broadcasts to everyone in general

    //Runs when client disconnects
    socket.on('disconnect', ()=> {
        io.emit('message', formatMessage( adminName, 'A User has left the chat.'))
    })

    // Listen for messages from chat
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg)); // emit to everyone
    })
})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(" this app runs on port 3000");
})


