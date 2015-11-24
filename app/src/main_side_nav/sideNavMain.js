/*
Main Side Menu Directive
*/

'use strict';

export default hileModule => {
  hileModule.directive('hileProfile', function() {
    return {
      restrict: 'E',
      scope: {},
      template: require('./mainNav.html')
    };
  });
};
