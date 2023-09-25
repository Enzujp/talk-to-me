const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: new mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        lowercase: true
    }, 
    password: {
        type: String,
        required: true
    }
})