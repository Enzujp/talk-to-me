const mongoose = require("mongoose");

const userSchema =  new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Enter a Usernname'],
        lowercase: true,
        unique: true
    }, 
    password: {
        type: String,
        required: [true, 'Please enter a password.']
    }
})


module.exports = mongoose.model('User', userSchema);