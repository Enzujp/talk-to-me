const User = require("../models/User");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: '2h'});
}

module.exports.signup_get = (req, res) => {
    res.render("signup");
}



module.exports.signup_post = async(req, res) => {
    const { username, password } = req.body
    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            res.status(409).json({
                message: "A User with this account already exists, try to login instead"
            })
        }
        else {
            // hash new user password
            const hashedPassword = await bcrypt.hash(password, 10)
            // create user
            const user = await User.create({
                _id: new mongoose.Types.ObjectId,
                username: username,
                password: hashedPassword
            })

            // create user token from generated id
            const userToken = createToken(user._id);

            res.status(201).json({
                message: "User created Successfully",
                user: user._id,
            })
            console.log(user)
        }
    } catch (err) {
        console.log(err)
    }
}




module.exports.login_get = (req, res) => {
    res.render("login");
}

module.exports.login_post = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({username: username})
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            const token = createToken(user._id)
            return res.status(200).json({
                user: user,
                message: "User logged in",
                token: token
            })
        } else {
            res.status(401).json({
                message: "Incorrect Password"
            })
        }
        
    } else {
        res.status(401).json({
            message: "Incorrect Username"
        })
    }
    
}

module.exports.logout_get = (req, res) => {
    console.log("This should hold");
}