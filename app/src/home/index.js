/**
 * Module : 'home'
 */


// Libs
const angular = require('angular');
const uiRouter = require('angular-ui-router');

// Services
const getAllProductsService = require('../datasync/get_all_products.service');

// Module and Controllers
const homeHileModule = angular.module('home', [uiRouter]);
const homerouting = require('./home.routes.js')(homeHileModule);
const homeController = require('./home.controller');



console.log(' ctrller :' + homeController);
homeHileModule.config(homerouting);
homeHileModule.service('GetAllProductsService',getAllProductsService);
homeHileModule.controller('HomeController' ,homeController);


console.log(' from : home index .js');

console.log('home router:' + homerouting);
console.log(homeHileModule);
console.log(homeHileModule.name);



export default homeHileModule;

