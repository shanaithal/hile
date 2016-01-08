var mongoose = require('mongoose');

var productSchema = mongoose.Schema({

	name: {
		type: String
	},
	description: {
		type: String
	},
	category_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category'
	},
	category_name: {
		type: String
	},
	sub_category_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'SubCategory'
	},
	sub_category_name: {
		type: String
	},
	home_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Home'
	},
	home_name: {
		type: String
	},
	owner_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	owner_mail: {
		type: String
	},
	rent_rate: {
		type: Number
	},
	time_preference: {
		start: {
			type: Date
		},
		end: {
			type: Date
		}
	},
	owned_from: {
		type: Date
	},
	quantity: {
		type: Number
	}
});

productSchema.index({
		name: 1,
		owner_mail: 1,
		home_name: 1
	},
	{
		unique: true
	});
productSchema.index({
	name: "text",
	description: "text",
	category_name: "text",
	sub_category_name: "text",
	home_name: "text",
	owner_mail: "text"
});

module.exports = mongoose.model('Product', productSchema);
