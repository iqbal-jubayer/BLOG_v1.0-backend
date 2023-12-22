const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {
    body,
    validationResult
} = require('express-validator');
const validator = require('validator');

const User = require('../models/User');

require('dotenv').config();

router.get('/',(req,res)=>{
    console.log(process.env.SALT_ROUND)
})

// Sign Up using POST: "localhost:5000/api/auth/createuser"
router.post('/createuser', [
    body("name").isLength({
        min: 3
    }),
    body("username").isLength({
        min: 5
    }),
    body("email").isEmail(),
    body("password").isLength({
        min: 6
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        let user = await User.findOne({
            email: req.body.email
        })
        if (!user) {
            user = User(req.body);
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt)
            user.password = secPass;
            user.save();

            const token = jwt.sign(user._id.toString(),process.env.SECRET_KEY)
            res.status(200).send(token)
        } else {
            res.status(400).send("Account with this email already exists!");
        }
    } else {
        res.status(400).send("Bad Request")
    }
})

// Sign In using POST: "localhost:5000/api/auth/signin"
router.post('/signin', [
    body("password").isLength({
        min: 6
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        let user;
        if(validator.isEmail(req.body.username)){
            user = await User.findOne({email: req.body.username})
        }else{
            user = await User.findOne({username: req.body.username})
        }
        if (user) {
            isAuthentic = await bcrypt.compare(req.body.password, user.password);
            if (isAuthentic) {
                const token = jwt.sign(user._id.toString(),process.env.SECRET_KEY);
                res.status(200).send(token);
            } else {
                res.status(400).send("Incorrect username or password");
            }
        } else {
            res.status(400).send("User doesn't exist");
        }
    } else {
        res.status(400).send(errors.array());
    }
})

// Get User Details Using POST: "localhost:5000/api/auth/getuser"
router.post('/getuser', async (req, res) => {
    const auth_token = req.headers['auth-token'];
    try {
        const userID = jwt.verify(auth_token, process.env.SECRET_KEY);
        const user = await User.findById(userID);
        res.send({
            "_id": user._id,
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "dpURL": user.dpURL,
            "date":user.date
        })
    } catch (err) {
        res.status(500).send("Internal Server Error")
    }
})

// Delete User using POST: "localhost:5000/api/auth/deleteuser"
router.post('/deleteuser', async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const auth_token = req.headers['auth-token'];
        try {
            let userID = jwt.verify(auth_token,process.env.SECRET_KEY);
            const user = await User.findByIdAndDelete(userID);
            if (user) {
                res.status(200).send("User Deletion Successfull")
            } else {
                res.status(400).send("User doesn't exist")
            }
        } catch (err) {
            res.status(500).send("Internal Server Error")
        }
    } else {
        res.status(400).send("Bad Request")
    }
})

// Get Auther Data using POST: "localhost:5000/api/auth/getauther"
router.post('/getauther', async (req, res) => {
    try {
        const user = await User.findOne(req.query)
        res.send({
            "name": user.name,
            "username": user.username,
            "email":user.email,
            "dpURL": user.dpURL,
            "date":user.date
        })
    } catch (err) {
        res.status(500).send("Internal Server Error")
    }
})

router.post('/getmeaillist', async (req, res) => {
    usernames = await User.find({}, {
        username: 1,
        email: 1,
        _id: 0
    })
    usernameList = []
    emailList = []
    usernames.map(e => {
        usernameList.push(e.username);
        emailList.push(e.email);

    })
    res.send({
        usernameList,
        emailList
    })
})


module.exports = router;