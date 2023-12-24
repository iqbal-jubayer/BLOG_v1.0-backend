const { Schema, model } = require('mongoose');

const User = Schema({
    name: String,
    username: {
        type: String,
        required: true
    },
    dpURL: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('users', User);