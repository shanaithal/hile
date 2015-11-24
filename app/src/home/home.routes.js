/**
 * home routes
 */

'use strict'

export default homeHileModule => {

  const routerConfig = function($stateProvider) {
    // Use $stateProvider to configure your states.
    $stateProvider
            .state('home', {
              url: '/',
              template: require('./home.html'),
              controller: 'HomeController as home'
            })
  };

  return routerConfig;
};
