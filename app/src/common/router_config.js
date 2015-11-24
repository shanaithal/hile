/**
 * Main Router configuration
 */
'use strict'

// var AboutController =
export default hileModule => {
  // const routeProvider = require('angular-ui-router');

  const routerConfig = function($stateProvider, $urlRouterProvider) {
    // Use $stateProvider to configure your states.
    $urlRouterProvider.otherwise('/')

  };

  return routerConfig;
};
