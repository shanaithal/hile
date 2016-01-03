var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
	data: {
		type: Buffer,
		unique: true
	},
	contet_type: {
		type: String
	},
	entity_type: {
		type: String
	},
	entity_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product'
	}
});

module.exports = mongoose.model('Image', imageSchema);