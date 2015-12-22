var express = require('express');
var router = express.Router();
var connector = new require('../utilities/dbconnector')();
var errorResponse = new require('../utilities/error_response')();
var Utility = new require('../utilities')();

function validUser(userObject) {

	var emailPattern = /^.*@.*\..*/;
	if (userObject.email.indexOf(" ") !== -1 || !emailPattern.test(userObject.email)) {

		return false;
	}

	return true;
}

router.route('/users')
	.post(function (request, response) {
		var userObject = request.body;
		if (!validUser(userObject)) {

			errorResponse.sendErrorResponse(response, 400, "Bad Request", "Invalid Payload");
		} else {
			connector.createUser(function (err, location) {
				if (err) {
					errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "Could not Create the User");
				} else {
					response.statusCode = 201;
					response.send(location);
				}
			}, userObject);
		}
	})
	.get(function (request, response) {
		var filters = Utility._getFilters(request.query);
		connector.getUsers(function (err, users) {
			if (err) {
				errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "Could not fetch users.");
			} else {
				if (users.length > 0) {
					response.status(200);
					response.setHeader('content-type', 'application/json');
					response.send(Utility.getFormattedResponse(users));
				} else {
					errorResponse.sendErrorResponse(response, 404, "Not Found", "There are no users in the System");
				}
			}
		}, filters[0], "collection");
	});

router.route('/users/:user_id')
	.put(function (request, response) {

		var user_id = request.params.user_id;
		var userObject = request.body;

		var emailPattern = /^.*@.*\..*/;
		if (emailPattern.test(user_id)) {
			connector.updateUser(function (err, location) {
				if (err) {
					errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "Could not update the User");
				} else {
					response.statusCode = 200;
					response.setHeader('content-type', 'application/json');
					response.send(location);
				}
			}, userObject, user_id, "email");
		} else {
			connector.updateUser(function (err, location) {
				if (err) {
					errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "Could not update the User");
				} else {
					response.statusCode = 200;
					response.setHeader('content-type', 'application/json');
					response.send(location);
				}
			}, userObject, user_id, "_id");
		}
	})
	.get(function (request, response) {
		var user_id = request.params.user_id;
		var emailPattern = /^.*@.*\..*/;
		if (emailPattern.test(user_id)) {
			connector.getUsers(function (err, user) {
				if (err) {
					errorResponse.sendErrorResponse(response, 404, "Not Found", "The requested resource not found.");
				} else {
					if (user) {
						response.statusCode = 200;
						response.setHeader('content-type', 'application/json');
						response.send(Utility.getFormattedResponse(user));
					} else {
						errorResponse.sendErrorResponse(response, 404, "Not Found", "The requested resource not found.");
					}
				}
			}, {
				email: user_id
			}, "email");
		} else {
			connector.getUsers(function (err, user) {
				if (err) {
					errorResponse.sendErrorResponse(response, 404, "Not Found", "The requested resource not found.");
				} else {
					if (user) {
						response.statusCode = 200;
						response.setHeader('content-type', 'application/json');
						response.send(Utility.getFormattedResponse(user));
					} else {
						errorResponse.sendErrorResponse(response, 404, "Not Found", "The requested resource not found.");
					}
				}
			}, {
				_id: user_id
			}, "_id");
		}
	}).delete(function (request, response) {
	var user_id = request.params.user_id;
	var emailPattern = /^.*@.*\..*/;
	if (emailPattern.test(user_id)) {
		connector.deleteUser(function (err) {
			if (err) {
				errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "The resource could not be deleted");
			} else {
				response.statusCode = 204;
				response.end();
			}
		}, user_id, "email");
	} else {
		connector.deleteUser(function (err) {
			if (err) {
				errorResponse.sendErrorResponse(response, 500, "Internal Server Error", "The resource could not be deleted");
			} else {
				response.statusCode = 204;
				response.end();
			}
		}, user_id, "_id");
	}

});

module.exports = router;
