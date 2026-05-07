const mongoose = require('mongoose');

const person = new mongoose.Schema({
    name: String,
    email: String,
    number: Number,
    password: String
});

module.exports = mongoose.model('person', person);
