const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

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

// Run when client connects
io.on('connection', socket => { // connect io to listen for connection
    console.log("New websocket connection");
})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(" this app runs on port 3000");
})


app.get('/', (req, res) => {
    res.send("Yup, this runs on port 3k")
})