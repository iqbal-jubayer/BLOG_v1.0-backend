// IMPORTING
const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');

require('dotenv').config(); // Parse .env file

// CONST VARIABLES
const PORT = Number(process.env.PORT) || 5000;

connectToMongo(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`); // Connect to Mongo DB

const app = express(); // Create App

// EXPRESS SPECIFIC CONF.
app.use(cors());
app.use(express.json());

// ENDPOINT
app.use('/api/blog',require('./routes/blogs'));
app.use('/api/auth',require('./routes/users'));

// RUN SERVER
app.listen(PORT,()=>{
    console.log(`App is running on ${PORT}`);
});