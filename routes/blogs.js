// IMPORT PACKAGES
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

// IMPORT MODEL
const Blog = require('../models/Blog');
const User = require('../models/User');

// Get all blogs using: GET "localhost:5000/api/blogs/getblogs" along with queries
router.get('/getblogs', async (req, res) => {
    try{
        const data = await Blog.find(req.query);
        res.status(200).send(data);
    }catch(err){
        res.status(400).send("No Blog");
    }
});


// Get a specific blog with blog's ID using: GET "localhost:5000/api/blogs/:blogID"
router.get('/:blogID', async (req, res) => {
    const blogID = req.params.blogID;
    try {
        const blog = await Blog.find({
            _id: blogID
        });
        res.status(200).send(blog);
    } catch (err) {
        res.status(404).send("Blog doesn't exist");
    };
});

// Create New Blog using: POST "localhost:5000/api/blogs/createblog"
router.post('/createblog', async (req, res) => {
    const auth_token = req.headers['auth-token'];
    const userID = jwt.verify(auth_token, process.env.SECRET_KEY);
    const auther = await User.findById(userID, {
        username: 1
    });
    const blogInfo = {
        ...req.body,
        "auther": auther['username']
    };
    const blog = Blog(blogInfo);
    blog.save();
    res.send(blog);
});

// Delete Blog using: POST "localhost:5000/api/blogs/deleteblog"
router.post('/deleteblog', async (req, res) => {
    const auth_token = req.headers['auth-token'];
    const blogID = req.headers['blog-id'];
    try {
        const userID = jwt.verify(auth_token, process.env.SECRET_KEY);
        const blog = await Blog.findById(blogID, {
            auther: 1
        });
        const auther = await User.findById(userID, {
            username: 1
        });
        if (auther['username'] === blog['auther']) {
            await Blog.findByIdAndDelete(blogID);
            res.send(`Blog ${blogID} has been deleted successfully!`);
        } else {
            res.send("no")
        }
    } catch (err) {
        msg = err.message
        if (msg == "invalid signature") {
            res.status(401).send("Invalid Authentication.")
        } else if (msg.includes("Cast to ObjectId failed")) {
            res.status(400).send("Blog doesn't exist.")
        } else if (msg == "Cannot read properties of null (reading 'auther')") {
            res.status(400).send("Blog doesn't exist.");
        } else {
            res.status(400).send(msg)
        }
    }
})

// Update Blog using: POST "localhost:5000/api/blogs/updateblog"
router.post('/updateblog', async (req, res) => {
    const auth_token = req.headers['auth-token'];
    const blogID = req.headers['blog-id'];
    const userID = jwt.verify(auth_token, process.env.SECRET_KEY);
    const blog = await Blog.findById(blogID, {
        auther: 1
    });
    const auther = await User.findById(userID, {
        username: 1
    });
    if (auther['username'] == blog['auther']) {
        await Blog.findByIdAndUpdate(blogID,req.body);
        res.send(`Blog ${blogID} has been updated successfully`);
    } else {
        res.send("no")
    }
})

module.exports = router;