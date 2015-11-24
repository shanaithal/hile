/**
 * renting routes
 */

'use strict'

export default rentingHileModule => {

  const routerConfig = function($stateProvider) {
    // Use $stateProvider to configure your states.
    $stateProvider
            .state('renting', {
              url: '/renting',
              template: require('./rentSearchResults.html'),
              controller: 'RentingController as renting'
            })
  };

  return routerConfig;
};
