angular.module('prestaplug', [
  'ionic',
  'prestaplug.services',
  'prestaplug.controllers',
  'LocalStorageModule'
])


.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('intro', {
      url: '/',
      templateUrl: 'templates/intro.html',
      controller: 'IntroCtrl'
    })
    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // the pet tab has its own child nav-view and history
    .state('tab.catalogue', {
      url: '/catalogue/:level',
      views: {
        'catalogue': {
          templateUrl: 'templates/catalogue.html',
          controller: 'CatalogueCtrl'
        }
      }
    })

    .state('tab.category', {
      url: '/category/:idcat',
      views: {
        'catalogue': {
          templateUrl: 'templates/category.html',
          controller: 'CategoryCtrl'
        }
      }
    })

    .state('tab.sync', {
      url: '/sync',
      views: {
        'sync': {
          templateUrl: 'templates/sync.html',
          controller: 'SyncCtrl'
        }
      }
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

})

.config(function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('pp');
});