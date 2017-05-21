// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('golocal', ['ionic', 'golocal.controllers', 'ui.calendar', 'golocal.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.favorites', {
    url: '/favorites',
    views: {
      'menuContent': {
        templateUrl: 'templates/favorites.html',
        controller: "FavoritesCtrl"
      }
    }
  }) 
  .state('app.account', {
      url: '/account',
      views: {
        'menuContent': {
          templateUrl: 'templates/account.html',
          controller: "AccountCtrl"
        }
      }
    }) 
  .state('app.map', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'templates/map.html',
          controller: "MapCtrl"
        }
      }
    })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })
    .state('app.calendar', {
      url: '/events',
      views: {
        'menuContent': {
          templateUrl: 'templates/calendar.html',
          controller: 'CalendarCtrl'
        }
      }
    }) 
    .state('app.submit', {
      url: '/submit_event',
      views: {
        'menuContent': {
          templateUrl: 'templates/event_submission.html',
          controller: 'SubmissionCtrl'
        }
      }
    }) 
    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html',
          controller: 'AboutCtrl'
        }
      }
    }) 
    .state('app.advertise', {
      url: '/advertise',
      views: {
        'menuContent': {
          templateUrl: 'templates/advertise.html',
          controller: 'AdvertiseCtrl'
        }
      }
    })

  .state('app.listings', {
    url: '/business_listings',
    views: {
      'menuContent': {
        templateUrl: 'templates/listings.html',
        controller: 'ListingCtrl'
      }
    } 
  })
    .state('app.specifics', {
    url: '/:company',
    views: {
      'menuContent': {
        templateUrl: 'templates/company_details.html',
        controller: 'CompaniesCtrl'
      }
    }
  })
    .state('app.details', {
    url: '/:category/details',
    views: {
      'menuContent': {
        templateUrl: 'templates/category_details.html',
        controller: 'DetailsCtrl'
      }
    }
  })     
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

app.run((FireBase)=>{
  let authConfig = {
    apiKey: FireBase.apiKey,
    authDomain: FireBase.authDomain
  };
  firebase.initializeApp(authConfig);
})