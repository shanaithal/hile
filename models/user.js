var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

	name: {
		type: String
	},
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
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

userSchema.index({
	name: "text",
	email: "text"
});

module.exports = mongoose.model('User', userSchema);
