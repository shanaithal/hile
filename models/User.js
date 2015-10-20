var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        index: true,
        unique: true
    },
    contact: {
        type: Number,
        unique: true,
        sparse: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
});

module.exports = mongoose.model('User', userSchema);
