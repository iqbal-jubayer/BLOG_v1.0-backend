const {
    Schema,
    model
} = require('mongoose');

const Blog = Schema({
    title: String,
    description: String,
    auther: String,
    topic: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('blogs', Blog);