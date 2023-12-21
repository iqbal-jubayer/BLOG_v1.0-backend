const {Schema, model} = require('mongoose');

const User = Schema({
    name:String,
    username:String,
    dpURL:String,
    email:String,
    password:String,
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = model('users',User);