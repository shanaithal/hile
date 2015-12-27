var mongoose = require('mongoose');
var User = require('../models/user');
var Home = require('../models/home');
var Category = require('../models/category');
var SubCategory = require('../models/sub_category');
var Product = require('../models/product');
var Buzz = require('../models/buzz');

var config = require('../config');
var fieldsOmittedFromResponse = {
	'__v': 0,
	'createdAt': 0
};

if (mongoose.connection.readyState === 0) {
	mongoose.connect(config.dbHost + '/' + config.databaseName);
}

var DBConnector = function () {
	return Object.create(DBConnector.prototype);
};

var selfRefObject = new DBConnector();

function _getLocation(resource_id, entity, operation, base_resource) {

	return {
		message: "The " + entity + " is " + operation + " successfully.",
		href: config.service_url + "/" + base_resource + "/" + resource_id
	};
}

DBConnector.prototype.createUser = function (callback, userObject) {
	var user = new User({
		name: userObject.name,
		email: userObject.email.toLowerCase(),
		contact: userObject.contact,
		rating: userObject.rating
	});
	user.save(function (err, data) {
		if (err) {
			callback(err);
		} else {
			callback(null, _getLocation(data._id, "user", "created", "users"));
		}
	});
};

DBConnector.prototype.updateUser = function (callback, userObject, user_id, identifierType) {

	userObject.email = userObject.email.toLowerCase();

	delete userObject.email;

	switch (identifierType) {
		case "email":
			User.findOneAndUpdate({
					email: new RegExp('^' + user_id + '$', "i")
				}, userObject, {
					new: true
				},
				function (err, user) {
					if (err) {
						callback(err);
					} else {
						callback(null, _getLocation(user._id, "user", "updated", "users"));
					}
				});
			break;
		case "_id":
			User.findOneAndUpdate({
					_id: user_id
				}, userObject, {
					new: true
				},
				function (err, user) {
					if (err) {
						callback(err);
					} else {
						callback(null, _getLocation(user._id, "user", "updated", "users"));
					}
				});
			break;
	}
};

DBConnector.prototype.getUsers = function (callback, filters, fetchType, paginationConfig, sort_config) {

	switch (fetchType) {
		case "collection":
			if (paginationConfig.limit > config.maxCount) {
				paginationConfig.skip = config.defaultSkip;
				paginationConfig.limit = config.defaultLimit;
			}
			if (paginationConfig === {}) {
				paginationConfig.skip = config.defaultSkip;
				paginationConfig.limit = config.defaultLimit;
			}
			if (paginationConfig.skip < 1) {
				console.log("You Idiot");
				paginationConfig.skip = config.defaultSkip;
				paginationConfig.limit = config.defaultLimit;
			}
			if (paginationConfig.skip > 0) {
				paginationConfig.skip = (paginationConfig.skip - 1) * paginationConfig.limit;
			}
			var query = User.find(filters, fieldsOmittedFromResponse, paginationConfig);
			if (sort_config !== {} && sort_config !== undefined) {
				var sort_order = sort_config.order === 'ascending' ? 1 : -1;
				var sort_params = sort_config.sort_params;

				for (var index in sort_params) {
					var sort_object = {};
					sort_object[sort_params[index]] = sort_order;
					query = query.sort(sort_object);
				}
			}
			query.exec(function (err, users) {
				if (err) {
					callback(err);
				} else {
					callback(null, users);
				}
			});
			break;
		case "email":
			User.find({
				email: new RegExp('^' + filters.email + '$', "i")
			}, fieldsOmittedFromResponse, function (err, user) {
				if (err) {
					callback(err);
				} else {
					callback(null, user);
				}
			});
			break;
		case "_id":
			User.findById(filters._id, fieldsOmittedFromResponse, function (err, user) {
				if (err) {
					callback(err);
				} else {
					callback(null, user);
				}
			});
			break;
	}
};

DBConnector.prototype.deleteUser = function (callback, user_id, identifierType) {

	switch (identifierType) {
		case "email":
			User.findOneAndRemove({
				email: user_id
			}, function (err) {
				if (err) {
					callback(err);
				} else {
					callback(null);
				}
			});
			break;
		case "_id":
			User.findOneAndRemove({
				_id: user_id
			}, function (err) {
				if (err) {
					callback(err);
				} else {
					callback(null);
				}
			});
			break;
	}
};

DBConnector.prototype.createHome = function (callback, homeObject, identifierType) {

	switch (identifierType) {

		case "email":
			User.findOne({
				email: homeObject.owner_mail
			}, {
				email: 1
			}, function (err, owner) {
				if (err) {
					callback(err);
				} else {
					if (owner) {
						var home = new Home({
							name: homeObject.name,
							owner_id: owner._id,
							owner_mail: owner.email,
							location: homeObject.location
						});

						home.save(function (err, home) {
							if (err) {
								callback(err);
							} else {
								callback(null, _getLocation(home._id, "home", "created", "homes"));
							}
						});
					} else {
						callback({});
					}
				}
			});
			break;
		case "_id":
			User.findOne({
				_id: homeObject.owner_id
			}, {
				email: 1
			}, function (err, owner) {
				if (err) {
					callback(err);
				} else {
					if (owner) {

						var home = new Home({
							name: homeObject.name,
							owner_id: owner._id,
							owner_mail: owner.email,
							location: homeObject.location
						});

						home.save(function (err, home) {
							if (err) {
								callback(err);
							} else {
								callback(null, _getLocation(home._id, "home", "created", "homes"));
							}
						});
					} else {
						callback({});
					}

				}
			});
	}
};

DBConnector.prototype.updateHome = function (callback, homeObject, home_id, identifierType) {

	delete homeObject.owner_id;
	delete homeObject.owner_mail;

	switch (identifierType) {
		case "_id":
			Home.findOneAndUpdate({
					"_id": home_id
				}, homeObject, {
					new: true
				},
				function (err, home) {
					if (err) {
						callback(err);
					} else {
						if (home !== null) {
							callback(null, _getLocation(home._id, "home", "updated", "homes"));
						} else {
							callback({message: "Internal DB     Error"});
						}
					}
				});
			break;
	}
};

DBConnector.prototype.getHomes = function (callback, filters, fetchType, paginationConfig, sort_config) {
	switch (fetchType) {
		case "collection":
			if (paginationConfig.limit !== null && paginationConfig.limit > config.maxCount) {
				paginationConfig.skip = config.defaultSkip;
				paginationConfig.limit = config.defaultLimit;
			}
			if (paginationConfig === {}) {
				paginationConfig.skip = config.defaultSkip;
				paginationConfig.limit = config.defaultLimit;
			}
			if (paginationConfig.skip < 1) {
				console.log("You Idiot");
				paginationConfig.skip = config.defaultSkip;
				paginationConfig.limit = config.defaultLimit;
			}
			if (paginationConfig.skip > 0) {
				paginationConfig.skip = (paginationConfig.skip - 1) * paginationConfig.limit;
			}
			var query = Home.find(filters, fieldsOmittedFromResponse, paginationConfig);
			if (sort_config !== {} && sort_config !== undefined) {
				var sort_order = sort_config.order === 'ascending' ? 1 : -1;
				var sort_params = sort_config.sort_params;

				for (var index in sort_params) {
					var sort_object = {};
					sort_object[sort_params[index]] = sort_order;
					query = query.sort(sort_object);
				}
			}
			query.exec(function (err, homes) {
				if (err) {
					callback(err);
				} else {
					callback(null, homes);
				}
			});
			break;
		case "_id":
			Home.findById(filters._id, fieldsOmittedFromResponse, function (err, home) {
				if (err) {
					callback(err);
				} else {
					callback(null, home);
				}
			});
			break;
	}
};

DBConnector.prototype.deleteHome = function (callback, home_id) {

	Home.findOneAndRemove({
			_id: home_id
		},
		function (err) {
			if (err) {
				callback(err);
			} else {
				callback(null);
			}
		});
};

DBConnector.prototype.createSubCategory = function (callback, sub_categoryObject) {

	var sub_category = new SubCategory({
		name: sub_categoryObject.name,
		description: sub_categoryObject.description,
		category_id: sub_categoryObject.category_id
	});

	sub_category.save(function (err, sub_category) {

		if (err) {
			callback(err);
		} else {
			callback(null, _getLocation(sub_category._id, "SubCategory", "created", "subcategories"));
		}
	});
};

DBConnector.prototype.getSubCategories = function (callback, filterObject, identifierType) {

	switch (identifierType) {
		case "_id":
			callback(null, {message: "UnderConstruction"});
			break;
		default :
			SubCategory.find(filterObject, fieldsOmittedFromResponse, function (err, subCategories) {
				if (err) {
					callback(err);
				} else {
					callback(null, subCategories);
				}
			});
			break;
	}
};

DBConnector.prototype.deleteSubCategory = function (callback, sub_category_id) {

	SubCategory.findOneAndRemove({_id: sub_category_id}, function (err) {

		if (err) {
			callback(err);
		} else {
			callback(null);
		}
	});
};

DBConnector.prototype.createCategory = function (callback, categoryObject) {

	var category = new Category({
		name: categoryObject.name,
		description: categoryObject.description
	});

	category.save(function (err, category) {
			if (err) {
				callback(err);
			} else {
				var sub_categories = categoryObject.sub_categories;
				if (sub_categories) {
					for (var sub_category in sub_categories) {

						sub_categories[sub_category].category_id = category._id;
						selfRefObject.createSubCategory(function (err) {
							if (err) {
								occured_error = err;
							}
						}, sub_categories[sub_category]);
					}
				}
				callback(null, _getLocation(category._id, "Category", "created", "categories"));
			}
		}
	);

}
;

DBConnector.prototype.getCategories = function (callback, filters, identifierType) {

	if (identifierType === "_id") {
		Category.findOne(filters, fieldsOmittedFromResponse, function (err, category) {
			if (err) {
				callback(err);
			} else {
				selfRefObject.getSubCategories(function (err, subCategories) {
					if (err) {
						callback(err);
					} else {
						if (subCategories.length > 0) {
							var clone = JSON.parse(JSON.stringify(category));
							clone.sub_categories = subCategories;
							clone = [clone];
							callback(null, clone);
						} else {
							callback(null, category);
						}
					}
				}, filters);
			}
		});
	} else {
		Category.find(filters, fieldsOmittedFromResponse, function (err, categories) {
			if (err) {
				callback(err);
			} else {
				callback(null, categories);
			}
		});
	}
};

DBConnector.prototype.deleteCategory = function (callback, category_id) {

	Category.findOneAndRemove({
			_id: category_id
		},
		function (err) {
			if (err) {
				callback(err);
			} else {
				callback(null);
			}
		});
};

DBConnector.prototype.createProduct = function (callback, productObject) {

	Home.findOne({
		_id: productObject.home_id
	}, {name: 1}, function (err, home) {

		if (err) {
			callback(err);
		} else {
			if (home !== null) {

				var product = new Product(productObject);

				product.save(function (err, product) {

					if (err) {
						callback(err);
					} else {
						callback(null, _getLocation(product._id, "Product", "created", "products"));
					}
				});
			} else {

				callback({});
			}
		}
	});
};

DBConnector.prototype.getProducts = function (callback, filters, fetchType, paginationConfig, sort_config) {

	if (paginationConfig.limit !== null && paginationConfig.limit > config.maxCount) {
		paginationConfig.skip = config.defaultSkip;
		paginationConfig.limit = config.defaultLimit;
	}
	if (paginationConfig === {}) {
		paginationConfig.skip = config.defaultSkip;
		paginationConfig.limit = config.defaultLimit;
	}
	if (paginationConfig.skip < 1) {
		console.log("You Idiot");
		paginationConfig.skip = config.defaultSkip;
		paginationConfig.limit = config.defaultLimit;
	}
	if (paginationConfig.skip > 0) {
		paginationConfig.skip = (paginationConfig.skip - 1) * paginationConfig.limit;
	}

	var query = Product.find(filters, fieldsOmittedFromResponse, paginationConfig);
	if (sort_config !== {} && sort_config !== undefined) {
		var sort_order = sort_config.order === 'ascending' ? 1 : -1;
		var sort_params = sort_config.sort_params;

		for (var index in sort_params) {
			var sort_object = {};
			sort_object[sort_params[index]] = sort_order;
			query = query.sort(sort_object);
		}
	}
	query.exec(function (err, products) {

		if (err) {

			callback(err);
		} else {

			callback(null, products);
		}
	});
};

DBConnector.prototype.updateProduct = function (callback, productObject) {

	Product.findOneAndUpdate({_id: productObject._id},
		productObject, {
			new: true
		},
		function (err, user) {
			if (err) {
				callback(err);
			} else {
				callback(null, _getLocation(user._id, "product", "updated", "products"));
			}
		});
};

DBConnector.prototype.deleteProduct = function (callback, product_id) {

	Product.findOneAndRemove({_id: product_id}, function (err) {

		if (err) {

			callback(err);
		} else {

			callback(null);
		}
	});
};

DBConnector.prototype.getSearchTerm = function (callback, search_terms, category) {

	var query;

	switch (category) {

		case "home":
			break;
		case "user":
			break;
		default:
			query = Product.find({$text: {$search: search_terms.q}});
	}

	query.exec(function (err, collections) {

		if (err) {

			callback(err);
		} else {

			callback(null, collections);
		}
	});
}

DBConnector.prototype.getCollectionCount = function (callback, collectionType) {

	switch (collectionType.toLowerCase()) {

		case "user":
			_getCollectionCount(callback, User);
			break;
		case "home":
			_getCollectionCount(callback, Home);
			break;
		case "product":
			_getCollectionCount(callback, Product);
			break;
		case "buzz":
			_getCollectionCount(callback, Buzz);
			break;
	}
};

function _getCollectionCount(callback, collectionType) {

	collectionType.find({}).count(function (err, count) {

		if (err) {
			callback(err);
		} else {
			callback(null, count);
		}
	});
}

module.exports = DBConnector;
