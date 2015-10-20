var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
    reviewer_id: String,
    review_comment: String,
    rating: {
    	type: Number,
    	min: 0,
    	max: 5,
    	default: 0
    },
    product_id: String
});

reviewSchema.index({
	product_id: 1,
	reviewer: String
},{
	unique: true
});

module.exports = mongoose.model('Review', reviewSchema);
