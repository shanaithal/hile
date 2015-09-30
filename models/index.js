var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		unique: true,
		index: true
	},
	contact: {
		type: Number,
		unique: true
	},
	rating: {
		type: Number,
		min: 0,
		max: 5,
		default: 0
	}
});

exports.User = mongoose.model('User', userSchema);

/////////////////////////////////////////////////////////////////////

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

exports.Home = mongoose.model('Home', householdSchema);

/////////////////////////////////////////////////////////////////////

var buzzSchema = mongoose.Schema({
	buzzer: String,
	time_slot: {
		start: String,
		end: String
	},
	negotiation_price: Number
});

//var Buzz = mongoose.model('Buzz', buzzSchema);

var reviewSchema = mongoose.Schema({
	reviewer: String,
	review_comment: String,
	rating: Number
});

//var Review = mongoose.model('Review', reviewSchema);

var productSchema = new mongoose.Schema({
	name: String,
	description: String,
	category: String,
	sub_category: String,
	home_name: String,
	owner_mail: String,
	rent_rate: Number,
	buzzes: [buzzSchema],
	reviews: [reviewSchema]
});

productSchema.index({
	name: 1,
	home_name: 1,
	owner_mail: 1
}, {
	unique: true
});

exports.Product = mongoose.model('Product', productSchema);