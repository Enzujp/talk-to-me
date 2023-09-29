const mongoose = require("mongoose");
const User = require("../src/models/User");

const users = [];

// Join User to chat 

const userJoin = (id, username, room) => {
    // create new instance of user model and embed user
    const user = {id, username, room};

    // append extracted user details to room
    users.push(user);

    return user
}

// Get current User

const getCurrentUser = (id) => {
    // for each user, identify user whose id matches given id
    return users.find(user => user.id === id); 

}

// User leaves chat
const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id) // index returns a negative 1 if id value doesnt match users
    if (index  !== -1) {
        return users.splice(index, 1)[0];
    } 
}

// Get all room Users
const getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
    
}

module.exports = {
    userJoin,
    getCurrentUser, 
    userLeave,
    getRoomUsers
}