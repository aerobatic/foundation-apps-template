var foundationRoutes = null;

(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations',
    'Aerobatic'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$FoundationStateProvider', 'aerobaticProvider'];

  function config($urlProvider, $locationProvider, FoundationStateProvider, aerobaticProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');

    FoundationStateProvider.registerDynamicRoutes([
      {
        "name":"home",
        "url":"/",
        "path": aerobaticProvider.config.cdnUrl + '/' + "templates/home.html"
      }
    ]);
  }

  function run() {
    FastClick.attach(document.body);
  }

})();
