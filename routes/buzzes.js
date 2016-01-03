var express = require('express');
var router = express.Router();
var connector = new require('../utilities/dbconnector')();
var errorResponse = new require('../utilities/error_response')();
var Utility = new require('../utilities')();

router.route('/buzzes')
	.post(function (request, response) {

		var buzzObject = request.body;
		connector.createBuzz(function (err, location) {

			if (err) {

				errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "The requested resource could not be created.");
			} else {

				response.status(201).json(location);
			}
		}, buzzObject);
	})
	.get(function (request, response) {

		var page = parseInt(request.query.page);
		var elementCount = parseInt(request.query.count);
		var sort_params = request.query.sortby;
		var sort_order = request.query.order;
		if (!Utility.isArray(sort_params)) {
			sort_params = [sort_params];
		}
		var sort_config = {sort_params: sort_params, order: sort_order};
		var filters = Utility._getFilters(request.query);
		var pagination_config = {};
		pagination_config.skip = page;
		pagination_config.limit = elementCount;

		connector.getBuzzes(function (err, buzzes) {

				if (err) {

					errorResponse.sendErrorResponse(response, 404, "Not Found", "The requested resource not found.");
				} else {

					if (buzzes.length > 0) {
						connector.getCollectionCount(function (err, collectionSize) {

							buzzes = Utility.getFormattedResponse(buzzes);
							buzzes.data.collection_size = collectionSize;
							if (collectionSize > elementCount) {
								buzzes.data.pages = [];
								var lastPage = collectionSize / elementCount;
								if (page < lastPage) {
									buzzes.data.pages.push(Utility.getNextPage(request.url, page + 1, elementCount));
								}
								if (page > 1) {
									buzzes.data.pages.push(Utility.getPreviousPage(request.url, page - 1, elementCount));
								}
							}
							response.status(200).json(buzzes);
						}, "buz");
					} else {
						errorResponse.sendErrorResponse(response, 404, "Not Found", "There are no homes in the System.");
					}
				}
			}
			,
			filters, "collection", pagination_config, sort_config);
	});

router.route('/buzzes/:buzz_id')
	.put(function (request, response) {

	}).get(function (request, response) {

	var buzz_id = request.params.buzz_id;
	connector.getBuzzes(function (err, buzz) {

		if (err) {

			errorResponse.sendErrorResponse(response, 404, "Not Found", "The requested resource not found.");
		} else {

			if (buzz.length > 0) {

				buzz = Utility.getFormattedResponse(buzz);
				response.status(200).json(buzz);
			} else {
				errorResponse.sendErrorResponse(response, 404, "Not Found", "There are no homes in the System.");
			}
		}
	}, {_id: buzz_id}, "_id");
}).delete(function (request, response) {

	var buzz_id = request.params.buzz_id;
	connector.deleteBuzz(function (err) {

		if (err) {

			errorResponse.sendErrorResponse(response, 404, "Not Found", "There are no homes in the System.");
		} else {

			response.status(204).send();
		}
	}, buzz_id);
});

module.exports = router;
