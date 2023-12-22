// IMPORT PACKAGES
const express = require('express');
const router = express.Router();

const Blog = require('../models/Blog'); // IMPORT MODEL

// Get all blogs using: GET "localhost:5000/api/blogs/getblogs" along with queries
router.get('/getblogs', async (req,res)=>{
    const data = await Blog.find(req.query);
    res.send(data);
});


// Get a specific blog with blog's ID using: GET "localhost:5000/api/blogs/:blogID"
router.get('/:blogID',async (req,res)=>{
    const blogID = req.params.blogID;
    try{
        const blog = await Blog.find({_id:blogID});
        res.status(200).send(blog);
    }catch(err){
        res.status(404).send("404 Not Found");
    };
});

module.exports = router;