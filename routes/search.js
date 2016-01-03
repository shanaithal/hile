var express = require('express');
var router = express.Router();
var connector = new require('../utilities/dbconnector')();
var errorResponse = new require('../utilities/error_response')();
var Utility = new require('../utilities')();

router.route('/search')
	.get(function (request, response) {

		var queryObject = request.query;
		var pageNumber = queryObject.page;
		var elementCount = queryObject.count;
		var sort_members = queryObject.sortby;
		var sort_order = queryObject.order;
		var sort_config = {sort_params: sort_members, order: sort_order};
		var queryParams = Utility._getFilters(queryObject);

		connector.getSearchTerm(function (err, search_items) {

			if (err) {
				errorResponse.sendErrorResponse(response, 404, "Not Found", "The requested resource could not be found");
			} else {

				response.status(200).json(Utility.getFormattedResponse(search_items));
			}
		}, queryParams);
	});

module.exports = router;