var Utility = function () {

	var utilityObject = Object.create(Utility.prototype);
	return utilityObject;
}

Utility.prototype.isArray = function (array) {

	if (array.constructor !== Array) {
		return false;
	}
	return true;
}

Utility.prototype.getFormattedResponse = function (resultSet) {
	if (!this.isArray(resultSet)) {
		resultSet = [resultSet];
	}
	var formatedResponse = {
		data: {
			items: resultSet
		}
	};
	return formatedResponse;
}

Utility.prototype._getFilters = function (queryParams) {

	var filters = [];
	for (var queryParam in queryParams) {
		if (queryParam) {
			filters.push(queryParam);
		}
	}
	//var clone = JSON.parse(JSON.stringify(queryParams));
	return filters;
}

module.exports = Utility;