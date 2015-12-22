var mongoose = require('mongoose');
var Location = require('./location');

var homeSchema = new mongoose.Schema({

	name: {
		type: String
	},
	location: {
		type: mongoose.Schema.Types,
		ref: 'Location'
	},
	owner_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	owner_mail: {
		type: String
	}
});

homeSchema.index({
	name: 1,
	owner_id: 1
}, {
	unique: true
});

module.exports = mongoose.model('Home', homeSchema);
