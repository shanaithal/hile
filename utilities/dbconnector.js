var mongoose = require('mongoose');
var User = require('../db/models/user');
var Home = require('../db/models/home');
var Category = require('../db/models/category');
var SubCategory = require('../db/models/sub_category');
var Product = require('../db/models/product');
var Buzz = require('../db/models/buzz');
var QueryBuilder = new require('./query_builder')();
var Image = require('../db/models/image');
var fs = require('fs');
var Utility = new require('./')();
var Review = require('../db/models/review');
var SMSClient = new require('./sms_alert')();
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
		rating: userObject.rating,
		user_role: userObject.user_role,
		social: userObject.social
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

DBConnector.prototype.getUsers = function (callback, filters, fetchType, pagination_config, sort_config) {

	switch (fetchType) {
		case "collection":
			var query = QueryBuilder.build(User, filters, fieldsOmittedFromResponse, sort_config, pagination_config)
			query.exec(function (err, users) {
				if (err) {

					callback(err);
				} else {

					callback(null, users);
				}
			});
			break;
		case "email":
			var query = QueryBuilder.build(User, {
				email: new RegExp('^' + filters.email + '$', "i")
			}, fieldsOmittedFromResponse);
			query.exec(function (err, user) {
				if (err) {
					callback(err);
				} else {

					Home.count({owner_mail: filters.email}, function (err, count) {

						if (count > 0) {

							Product.count({owner_mail: filters.email}, function (err, product_count) {

								if (product_count > 0) {

									callback(null, Utility.getLinkedObjects(user, {
										type: "user",
										linked_objects: ["home", "product"]
									}));
								} else {

									callback(null, Utility.getLinkedObjects(user, {
										type: "user",
										linked_objects: ["home"]
									}));
								}
							});
						} else {

							callback(null, user);
						}
					});
				}
			});
			break;
		case "_id":
			var query = QueryBuilder.build(User, {_id: filters._id}, fieldsOmittedFromResponse);
			query.exec(function (err, user) {
				if (err) {
					callback(err);
				} else {

					Home.count({owner_id: filters._id}, function (err, count) {

						if (count > 0) {

							Product.count({owner_id: filters._id}, function (err, product_count) {

								if (product_count > 0) {

									callback(null, Utility.getLinkedObjects(user, {
										type: "user",
										linked_objects: ["home", "product"]
									}));
								} else {

									callback(null, Utility.getLinkedObjects(user, {
										type: "user",
										linked_objects: ["home"]
									}));
								}
							});
						} else {

							callback(null, user);
						}
					});
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
							location: homeObject.location,
							home_type: homeObject.home_type,
							community_name: homeObject.community_name
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

DBConnector.prototype.getHomes = function (callback, filters, fetchType, pagination_config, sort_config) {
	switch (fetchType) {
		case "collection":
			var query = QueryBuilder.build(Home, filters, fieldsOmittedFromResponse, sort_config, pagination_config);
			query.exec(function (err, homes) {
				if (err) {
					callback(err);
				} else {
					callback(null, homes);
				}
			});
			break;
		case "_id":
			var query = QueryBuilder.build(Home, {_id: filters._id}, fieldsOmittedFromResponse);
			query.exec(function (err, home) {
				if (err) {
					callback(err);
				} else {

					Product.count({home_id: filters._id}, function (err, count) {

						if (count > 0) {

							callback(null, Utility.getLinkedObjects(home, {
								type: "home",
								linked_objects: ["user", "product"]
							}));
						} else {

							callback(null, Utility.getLinkedObjects(home, {type: "home", linked_objects: ["user"]}));
						}
					});
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
			SubCategory.findById(filterObject._id, fieldsOmittedFromResponse, function (err, subCategory) {

				if (err) {

					callback(err);
				} else {

					callback(null, subCategory);
				}
			})
			break;
		default :
			var query = QueryBuilder.build(SubCategory, filterObject, fieldsOmittedFromResponse);
			query.exec(function (err, subCategories) {
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

};

DBConnector.prototype.getCategories = function (callback, filters, identifierType) {

	var query;
	switch (identifierType) {
		case "_id":
			query = QueryBuilder.build(Category, filters, fieldsOmittedFromResponse);
			query.exec(function (err, category) {
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
			break;
		default:
			query = QueryBuilder.build(Category, filters, fieldsOmittedFromResponse);
			query.exec(function (err, categories) {
				if (err) {
					callback(err);
				} else {
					callback(null, categories);
				}
			});
			break;
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

DBConnector.prototype.getProducts = function (callback, filters, fetchType, pagination_config, sort_config) {

	var query;
	switch (fetchType) {
		case "_id":
			query = QueryBuilder.build(Product, {_id: filters._id}, fieldsOmittedFromResponse, pagination_config, sort_config);
			query.exec(function (err, product) {

				if (err) {

					callback(err);
				} else {

					Buzz.count({product_id: filters._id}, function (err, count) {

						if (count > 0) {

							product = Utility.getLinkedObjects(product, {
								type: "product",
								linked_objects: ["buzz"]
							})[0];
						}

						Review.count({product_id: filters._id}, function (err, review_count) {

							if (review_count > 0) {

								product = Utility.getLinkedObjects(product, {
									type: "product",
									linked_objects: ["review"]
								})[0];
							}

							Image.find({
								entity_type: "product",
								entity_id: product._id
							}, {_id: 1}, function (err, images) {

								if (product.images === undefined) {
									product.images = [];
								}
								images.forEach(function (element, index) {

									var image_link = {
										href: config.service_url + "/images/" + element._id,
										rel: "Image"
									}

									product.images.push(image_link);
								});
								callback(null, product);
							});
						});
					});
				}
			});
			break;
		default:
			query = QueryBuilder.build(Product, filters, fieldsOmittedFromResponse, pagination_config, sort_config);
			query.exec(function (err, products) {

				if (err) {

					callback(err);
				} else {

					callback(null, products);
				}
			});
	}
};

DBConnector.prototype.updateProduct = function (callback, productObject) {

	Product.findOneAndUpdate({_id: productObject._id},
		productObject, {
			new: true
		},
		function (err, product) {
			if (err) {
				callback(err);
			} else {
				callback(null, _getLocation(product._id, "product", "updated", "products"));
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

DBConnector.prototype.createBuzz = function (callback, buzzObject) {

	var product_owner_id;
	selfRefObject.getProducts(function (err, product) {

		if (err) {

			callback(err);
		} else {

			if ((product === null) || product.keys().length === 0 || product.length === 0) {

				callback({});
			} else {
				product_owner_id = product[0].owner_id;
				selfRefObject.getUsers(function (err, user) {

					user = user[0];
					if (err) {

						callback(err);
					} else {

						if ((user === null) || user === {}) {

							callback({});
						} else {
							var start = new Date(buzzObject.time_preference.start);
							var end = new Date(buzzObject.time_preference.end);

							if (start < end) {

								if (String(product_owner_id) === String(user._id)) {

									callback({});
								} else {

									var buzz = new Buzz({
										buzzer_mail: user.email,
										buzzer_id: user._id,
										product_id: buzzObject.product_id,
										product_owner_id: product_owner_id,
										time_preference: {
											start: start,
											end: end
										},
										negotiation_price: buzzObject.negotiation_price
									});

									buzz.save(function (err, buzz) {

										if (err) {

											callback(err);
										} else {

											SMSClient.triggerAlert(buzz);
											callback(null, _getLocation(buzz._id, "Buzz", "created", "buzzes"));
										}
									});
								}
							} else {

								callback({});
							}
						}
					}
				}, {email: buzzObject.buzzer_mail}, "email");
			}
		}
	}, {_id: buzzObject.product_id}, "_id");
};

DBConnector.prototype.getBuzzes = function (callback, filters, fetchType, pagination_config, sort_config) {

	var query;
	switch (fetchType) {

		case "_id":

			query = QueryBuilder.build(Buzz, filters, fieldsOmittedFromResponse);
			break;
		default:

			query = QueryBuilder.build(Buzz, filters, fieldsOmittedFromResponse, sort_config, pagination_config);
	}
	query.exec(function (err, buzzes) {

		if (err) {

			callback(err);
		} else {

			callback(null, Utility.getLinkedObjects(buzzes, {type: "buzz"}));
		}
	});
};

DBConnector.prototype.updateBuzz = function (callback, buzzObject) {

};

DBConnector.prototype.deleteBuzz = function (callback, buzz_id) {

	Buzz.findOneAndRemove({_id: buzz_id}, function (err) {

		if (err) {

			callback(err);
		} else {

			callback(null);
		}
	});
};

DBConnector.prototype.uploadImage = function (callback, file_path, entity_info) {

	switch (entity_info.type) {

		case "product":
			Product.findById(entity_info.id, {name: 1}, function (err, product) {

				if (err) {

					callback(err);
				} else {

					var file_content = new Buffer(fs.readFileSync(file_path)).toString('base64');
					var image = new Image({
						content: file_content,
						content_type: file_path.split(".")[1],
						entity_type: entity_info.type,
						entity_id: product._id
					});

					image.save(function (err, image) {

						if (err) {

							callback(err);
						} else {

							callback(null, _getLocation(image._id, "Image", "uploaded", "images"))
						}
					});
				}
			});
			break;
	}
};

DBConnector.prototype.getImages = function (callback, filters, fetchType) {

	switch (fetchType) {

		case "_id":
			Image.findOne({_id: filters._id}, fieldsOmittedFromResponse, function (err, image) {

				if (err) {

					callback(err);
				} else {

					callback(null, image);
				}
			});
			break;
		default:
			Image.find(filters, fieldsOmittedFromResponse, function (err, images) {

				if (err) {

					callback(err);
				} else {

					callback(null, images);
				}
			});
	}
};

DBConnector.prototype.getSearchTerm = function (callback, search_term, entity_type, filters, pagination_config) {

	var query;

	switch (entity_type) {

		case "home":
			break;
		case "user":
			break;
		default:
			//query = Product.find({$text: {$search: search_term}});
			if (pagination_config.limit > config.maxCount) {
				pagination_config.skip = config.defaultSkip;
				pagination_config.limit = config.defaultLimit;
			}
			if (pagination_config === {}) {
				pagination_config.skip = config.defaultSkip;
				pagination_config.limit = config.defaultLimit;
			}
			if (pagination_config.skip < 1) {
				pagination_config.skip = config.defaultSkip;
				pagination_config.limit = config.defaultLimit;
			}
			if (pagination_config.skip > 0) {
				pagination_config.skip = (pagination_config.skip - 1) * pagination_config.limit;
			}
			var regExPattern = new RegExp('.*' + search_term + '.*', 'i');
			query = Product.find({
				$or: [{name: {$regex: regExPattern}},
					{description: {$regex: regExPattern}}, {category_name: {$regex: regExPattern}},
					{sub_category_name: {$regex: regExPattern}}, {home_name: {$regex: regExPattern}},
					{owner_mail: {$regex: regExPattern}}]
			}, fieldsOmittedFromResponse);
	}

	for (var key in filters.keys) {

		query.where(key).equals(filters(key));
	}
	query.lean().exec(function (err, resultSet) {

		var pageElements = [];
		console.log(pagination_config);
		if (pagination_config.skip === undefined) {

			pageElements.push(resultSet);
		} else {

			for (var index = pagination_config.skip; index <= pagination_config.skip * pagination_config.limit; index++) {
				pageElements.push(resultSet[index]);
			}
		}
		callback(null, pageElements, resultSet.length);
	});
	//
	//query.exec(function (err, collections) {
	//
	//	if (err) {
	//
	//		callback(err);
	//	} else {
	//
	//		var regExPattern = new RegExp('/.*' + search_term + '.*/i');
	//		if (filters.keys !== 0) {
	//			Product.find().and([{$or:[{name: {$regex: regExPattern}},
	//				{description: {$regex: regExPattern}}, {category_name: {$regex: regExPattern}},
	//				{sub_category_name: {$regex: regExPattern}}, {home_name: {$regex: regExPattern}},
	//				{owner_mail: {$regex: regExPattern}}]},
	//				filters]).exec(function (err, resultSet) {
	//				callback(null, resultSet);
	//			});
	//		} else Product.find({$or:[{name: {$regex: regExPattern}},
	//			{description: {$regex: regExPattern}}, {category_name: {$regex: regExPattern}},
	//			{sub_category_name: {$regex: regExPattern}}, {home_name: {$regex: regExPattern}},
	//			{owner_mail: {$regex: regExPattern}}]}, function (err, resultSet) {
	//
	//			callback(null, resultSet);
	//		});
	//
	//		callback(null, collections);
	//	}
	//});
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
