const express = require('express');
const router = express.Router();

const Blog = require('../models/Blog')

router.get('/getblogs', async (req,res)=>{
    const data = await Blog.find(req.query);
    res.send(data)
})

router.get('/:blogID',async (req,res)=>{
    const blogID = req.params.blogID
    try{
        const blog = await Blog.find({_id:blogID})
        res.status(200).send(blog)
    }catch(err){
        res.status(404).send("404 Not Found");
    }
})

module.exports = router;