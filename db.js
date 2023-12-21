// IMPORTING
const {connect} = require('mongoose');

const connectToMongo = (url)=>{
    connect(url).then(res=>{console.log("connected to Mongo")})
}

module.exports = connectToMongo;