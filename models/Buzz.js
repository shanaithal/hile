var mongoose = require('mongoose');

var buzzSchema = mongoose.Schema({

	buzzer_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	buzzer_name: {
		type: String
	},
	time_preference: {
		start: {
			type: Date
		},
		end: {
			type: Date
		}
	},
	negotiation_price: {
		type: Number
	},
	product_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product'
	},
	buzzedAt: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Buzz', buzzSchema);
