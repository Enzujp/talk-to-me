const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
// initialize dotenv for use
require("dotenv").config();


const app = express();
const server = http.createServer(app);
const io = socketio(server); // initialize socketio with server

const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./src/routes/authRoutes");


// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());
app.use('/user', userRoutes);

// Use static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

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
    console.log(" this app runs on port 3000");
})


