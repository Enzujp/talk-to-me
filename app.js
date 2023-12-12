const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
// initialize dotenv for use
require("dotenv").config();


const app = express();
const server = http.createServer(app);
const io = socketio(server); // initialize socketio with server

// set view engine
app.set('view engine', 'ejs');


const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const authRoutes = require("./src/routes/authRoutes");


// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
// routes to be used
app.use(authRoutes);


// Database Connections
const dbURI = "mongodb+srv://jahypee:babyboy@cluster0.whwk1gk.mongodb.net/";
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((results) => {
    console.log("Successfully connected to database")
})
.catch(err => {
    console.log(err);
})


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`This app runs on port ${PORT}`);
})

app.get('/', (req, res) => {
    res.render('index');
})

// app.get('/chat', (req, res) => {
//     res.render('chat');
// })

// Use middleware to keep users from main chat app til they're logged in
// Adjust css styling for chat containers