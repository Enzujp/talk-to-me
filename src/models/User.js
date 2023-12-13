const mongoose = require("mongoose");

const userSchema =  new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: [true, 'Enter a Usernname'],
        lowercase: true,
        unique: true
    }, 
    password: {
        type: String,
        minlength: [6, "Please enter a password longer than 5 characters"],
        required: [true, 'Please enter a password.']
    }
})


module.exports = mongoose.model('User', userSchema);