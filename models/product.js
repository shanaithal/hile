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
	}
});

productSchema.index({
	product_name: 1,
	home_id: 1,
	owner_id: 1
}, {
	unique: true
})

module.exports = mongoose.model('Product', productSchema);
