const User = require("../models/User");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: '2h'});
}

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', password: '' };
  
    // duplicate email error
    if (err.code === 11000) {
      errors.username = 'this username is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
  
      // incorrect email
      if (err.message === "Incorrect Email Address Entered") {
        errors.email = "That email is not registered"
      }
  
      // incorrect password
      if (err.message === "Incorrect Passoword") {
        err.password = "Your Password is Incorrect."
      }
    }
  
    return errors;
  }


// Get  signup page
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
                    const errors = handleErrors(err)
                    console.log(errors)
                    res.status(500).json(errors)
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
    // write a function that expires user token in milliseconds
}