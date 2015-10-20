var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    sub_category: String,
    home_name: String,
    owner_mail: String,
    rent_rate: Number,
});

productSchema.index({
    name: 1,
    home_name: 1,
    owner_mail: 1
}, {
    unique: true
});

module.exports = mongoose.model('Product', productSchema);
