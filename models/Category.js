var mongoose = require('mongoose');

var subcategory = {
    name: String,
    description: String
};

var categorySchema = mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique: true
    },
    description: String,
    subcategories: [subcategory]
});

module.exports = mongoose.model('Category', categorySchema);
