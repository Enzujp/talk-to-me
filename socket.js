const server = http.createServer(app);
const io = socketio(server); // initialize socketio with server
const User = require("./src/models/User");

const adminName = 'Lord Enzu';
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers} = require("./utils/users");

// Run when client connects, listen for connection  
io.on('connection', socket => { 
    // Join room
    socket.on('joinRoom', ({ username, room }) => {
     const user = userJoin(socket.id, username, room);   
    socket.join(user.room); // built-in room functionality


    
    // Welcome User, broadcasts to single user
    socket.emit('message', formatMessage(adminName, 'Welcome to talk to me!')); 

    //Alert room of a new member joining
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
    });

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
    
}); 
