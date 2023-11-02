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
    const username = req.body.username
    const password = req.body.password
    // const { username, password } = req.body;
    const existingUser = await User.findOne({username})
    if (existingUser) {
        res.status(409).json({
            message: "An account with this username already exists, choose a different username"
        })
    }
    else {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                res.status(500).json({
                    error: err,
                    message: "find me here please"
                })
            }
            else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId,
                    username: username,
                    password: hash
                })
                user.save()
                .then(result => {
                    res.status(201).json({
                        message: "User created successfully",
                        user: user._id,
                        password: hash
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        err: err,
                        message: "Find me here, I'm an error"
                    })
                })
            }
            
        })
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