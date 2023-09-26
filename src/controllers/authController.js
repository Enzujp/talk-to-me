const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup_get = (req, res) => {
    res.render("signup");
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: '2h'});
}

module.exports.signup_post = async (req, res) => {
    const { username, password } = req.body
    try{
        // Check to see if User already exists
        const existingUser = await User.findOne({username});

        if (existingUser) {
            res.status(409).json({
                message: "This user already exists, try to Login instead"
            })
            res.redirect('login');
        }
        // hash user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = User.create({
            username: username,
            password: encryptedPassword
        })

        // Create token using id from registered user
        const token = createToken(user._id);
        
        // Return new User
        res.status(201).json({
            messaege: "User successfully created",
            user
        })

    }
    catch(err) {
        console.log(err);
    }
}


module.exports.signin_get = (req, res) => {
    res.render("signin");
}

module.exports.signin_post = (req, res) => {
    
}

module.exports.logout_get = (req, res) => {
    console.log("This should hold");
}