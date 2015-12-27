var config = require('../config');

var Utility = function () {

	var utilityObject = Object.create(Utility.prototype);
	return utilityObject;
}

Utility.prototype.isArray = function (array) {

	if (array === null || array === undefined) {

		return false;
	}
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

	var filters = queryParams;
	if (filters.page != undefined) {
		delete filters.page;
	}
	if (filters.count != undefined) {
		delete filters.count;
	}
	if (filters.sortby != undefined) {
		delete filters.sortby;
	}
	if (filters.order != undefined) {
		delete filters.order;
	}
	//var clone = JSON.parse(JSON.stringify(queryParams));
	return filters;
}

Utility.prototype.getNextPage = function (path, page, count) {

	path = path.replace(/[p][a][g][e][=][0-9]+[&]/i, "").replace(/[p][a][g][e][=][0-9]+/i, "");
	path = path.replace(/[c][o][u][n][t][=][0-9]+[&]/i, "").replace(/[c][o][u][n][t][=][0-9]+/i, "");
	path = config.service_url + path;
	if (path.indexOf('?') > -1) {
		path = path + "page=" + page + "&count=" + count;
	} else {
		path = path + "&page=" + page + "&count=" + count;
	}

	return _getLinkObject(path, "next");
};

Utility.prototype.getPreviousPage = function (path, page, count) {

	path = path.replace(/[p][a][g][e][=][0-9]+[&]/i, "").replace(/[p][a][g][e][=][0-9]+/i, "");
	path = path.replace(/[c][o][u][n][t][=][0-9]+[&]/i, "").replace(/[c][o][u][n][t][=][0-9]+/i, "");
	path = config.service_url + path;
	if (path.indexOf('?') > -1) {
		path = path + "page=" + page + "&count=" + count;
	} else {
		path = path + "&page=" + page + "&count=" + count;
	}

	return _getLinkObject(path, "prev");
};

function _removePageCountQueryParams(path) {

	return path;
}

function _getLinkObject(path, rel) {

	var linkObject = {};
	linkObject.href = path;
	linkObject.rel = rel;

	return linkObject;
}
module.exports = Utility;