var express = require('express');
var router = express.Router();
var connector = new require('../utilities/dbconnector')();
var errorResponse = new require('../utilities/error_response')();
var Utility = new require('../utilities')();

router.route('/products')
	.post(function (request, response) {

		var productObject = request.body;
		connector.getCategories(function (err, category) {

			if (err) {

				errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "The requested resource could not be created");
			} else {

				productObject.category_id = category._id;
				connector.getSubCategories(function (err, subCategories) {
					if (err) {

						errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "The requested resource could not be created");
					} else {

						var subCategory = subCategories[0];
						productObject.sub_category_id = subCategory._id;
						connector.getHomes(function (err, homes) {

							if (err) {

								errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "The requested resource could not be created");
							} else {

								var home = homes[0];
								productObject.home_id = home._id;
								productObject.owner_id = home.owner_id;

								connector.createProduct(function (err, location) {

									if (err) {
										errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "The requested resource could not be created");
									} else {

										response.status(201).json(location);
									}
								}, productObject);
							}
						}, {name: productObject.home_name, owner_mail: productObject.owner_mail}, "collection");
					}
				});
			}
		}, {name: productObject.category_name}, "_id");
	}).get(function (request, response) {

	var filters = Utility._getFilters(request.query);
	connector.getProducts(function (err, products) {
		if (err) {

			errorResponse.sendErrorResponse(response, 404, "Not Found", "The requested resource not found.");
		} else {

			response.status(200).json(Utility.getFormattedResponse(products));
		}
	}, filters, "collection");
});

router.route('/products/:product_id')
	.get(function (request, response) {

		var product_id = request.params.product_id;
		connector.getProducts(function (err, product) {

			if (err) {

				errorResponse.sendErrorResponse(response, 404, "Not Found", "The requested resource not found.");
			} else {

				response.status(200).json(Utility.getFormattedResponse(product));
			}
		}, {_id: product_id}, "collections");
	}).put(function (request, response) {

	var productObject = request.body;
	connector.updateProduct(function (err, location) {

		if (err) {

			console.log ("Gotcha.." + JSON.stringify(err));
			errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "The requested resource could not be updated");
		} else {

			response.status(200).json(location);
		}
	}, productObject);
}).delete(function (request, response) {

	connector.deleteProduct(function (err) {

		if (err) {

			errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "The requested resource could not be deleted");
		} else {

			response.status(204).send();
		}
	}, request.params.product_id);
});

module.exports = router;