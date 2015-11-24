/**
 * Module : 'renting'
 */



const angular = require('angular');
const uiRouter = require('angular-ui-router');

// renting Module  
const rentingHileModule = angular.module('renting', [uiRouter]);
const rentingrouting = require('./renting.routes.js')(rentingHileModule);
const rentingController = require('./renting.controller');


rentingHileModule.config(rentingrouting);
rentingHileModule.controller('RentingController' ,rentingController);


export default rentingHileModule;

