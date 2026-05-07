const moongoose = require('mongoose');

const admin = new moongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    }
});

module.exports = moongoose.model('Admin', admin);