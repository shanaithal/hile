/**
 * application 'index'
 */

import angular from 'angular';
import uiRouter from 'angular-ui-router';

const home = require('./src/home/').name;

const hileModule = angular.module('Hile', [uiRouter,home]);
const routing = require('./src/common/router_config')(hileModule);

hileModule.config(routing);

require('./src/main_side_nav/')(hileModule);


console.log('router:' + routing);
console.log('Main index .js');