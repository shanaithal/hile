var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({

	name: {
		type: String,
		index: true,
		unique: true
	},
	description: {
		type: String
	}
});

module.exports = mongoose.model('Category', categorySchema);
