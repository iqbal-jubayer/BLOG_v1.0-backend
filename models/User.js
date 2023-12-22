const {
    Schema,
    model
} = require('mongoose');

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
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('users', User);