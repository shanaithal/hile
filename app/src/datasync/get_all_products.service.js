/**
 * get_all_products
 * @description  : Get all products for the given generic parameters from the households
 *
 */


const angular = require('angular');
// const angular_resource = require('angular-resource');
// const baseUrl = require('./common/base_url');


class GetAllProductsService {
    constructor($http) {
        this.$http = $http;
         this.names = ['John', 'Mark', 'Annie'];
    }

    getName() {
        const totalNames = this.names.length;
        const rand = Math.floor(Math.random() * totalNames);
        return this.names[rand];
    }
}

export default GetAllProductsService;

