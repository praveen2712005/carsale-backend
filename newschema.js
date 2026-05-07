const mongoose = require('mongoose');
const newuser=new mongoose.Schema({
    name:String,
    model:String,
    price:Number,
    status:String,
    year:Number
});

module.exports = mongoose.model('NewUser', newuser);