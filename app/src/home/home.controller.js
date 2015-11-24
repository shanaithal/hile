/**
 * HomeController for home module
 */
'use strict'

export default class HomeController {
  constructor(GetAllProductsService) {
    var home = this;
    home.getAllProductsService = GetAllProductsService;
    // home.name = 'Home Page this is  ';
    home.name = home.getAllProductsService.getName();
    // $scope.name = "Hello";
    console.log('this' +  home.name + 'about it  ') ;
  }
}