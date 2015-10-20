var mongoose = require('mongoose');

var buzzSchema = mongoose.Schema({
    product_id: String,
    buzzer: String,
    time_slot: {
        start: String,
        end: String
    },
    negotiation_price: Number
});

module.exports = mongoose.model('Buzz', buzzSchema);