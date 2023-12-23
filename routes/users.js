// IMPORT PACKAGES
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {
    body,
    validationResult
} = require('express-validator');
const validator = require('validator');

require('dotenv').config(); // Parse .env file

const User = require('../models/User'); // IMPORT MODEL

// FOR TRIAL
router.get('/', async (req, res) => {
    res.send("Hello World!");
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
        let user_email = await User.findOne({email: req.body.email});
        let user_username = await User.findOne({username: req.body.username});

        if (!user_email & !user_username) {
            let user = User(req.body);
            const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
            const secPass = await bcrypt.hash(req.body.password, salt);
            user.password = secPass;
            user.save();

            const token = jwt.sign(user._id.toString(), process.env.SECRET_KEY);
            res.status(200).send(token);
        } else {
            res.status(400).send("Account with this email already exists!");
        };
    } else {
        res.status(400).send("Bad Request");
    };
});

// Sign In using POST: "localhost:5000/api/auth/signin"
router.post('/signin', [
    body("password").isLength({
        min: 6
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        let user;
        if (validator.isEmail(req.body.username)) {
            user = await User.findOne({email: req.body.username},{password:1})
        } else {
            user = await User.findOne({username: req.body.username},{password:1});
        };
        
        if (user) {
            isAuthentic = await bcrypt.compare(req.body.password, user.password);
            if (isAuthentic) {
                const token = jwt.sign(user._id.toString(), process.env.SECRET_KEY);
                res.status(200).send(token);
            } else {
                res.status(400).send("Incorrect username or password");
            };
        } else {
            res.status(400).send("User doesn't exist");
        };
    } else {
        res.status(400).send(errors.array());
    };
});

// Get User Details Using POST: "localhost:5000/api/auth/getuser"
router.post('/getuser', async (req, res) => {
    const auth_token = req.headers['auth-token'];
    try {
        const userID = jwt.verify(auth_token, process.env.SECRET_KEY);
        const user = await User.findById(userID);
        res.send(user);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    };
});

// Get Auther Data using POST: "localhost:5000/api/auth/getauther"
router.post('/getauther', async (req, res) => {
    try {
        const user = await User.findOne(req.query)
        res.send(user);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    };
});

// Get List of existing Email and Username using POST: "localhost:5000/api/auth/getmeaillist"
router.post('/getmeaillist', async (req, res) => {
    let usernameList = [];
    let emailList = [];

    const usernames = await User.find({}, {
        username: 1,
        email: 1,
        _id: 0
    });
    
    usernames.map(e => {
        usernameList.push(e.username);
        emailList.push(e.email);
    });
    res.send({
        usernameList,
        emailList
    });
});

module.exports = router;