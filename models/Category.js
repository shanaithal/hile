var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    description: String,
    subcatrgories: [{
        name: String,
        description: String
    }]
});

module.exports = mongoose.model('Category', categorySchema);