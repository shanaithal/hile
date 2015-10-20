var mongoose = require('mongoose');

var householdSchema = new mongoose.Schema({
    name: String,
    location: {
        address1: String,
        address2: String,
        town: String,
        state: String,
        pincode: Number
    },
    owner_mail: String
});

householdSchema.index({
    name: 1,
    owner_mail: 1
}, {
    unique: true
});

module.exports = mongoose.model('Home', householdSchema);