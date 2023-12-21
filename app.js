// IMPORTING
const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT|5000

connectToMongo(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/blog',require('./routes/blogs'));
app.use('/api/auth',require('./routes/users'));

app.listen(PORT,()=>{
    console.log(`App is running on ${PORT}`);
})