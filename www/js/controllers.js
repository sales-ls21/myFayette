angular.module('golocal.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.signupData = {};

  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal){
    $scope.signupModal = modal;
  });

    $scope.closeSignUp = function() {
    $scope.signupModal.hide();
  };

  $scope.register = function(){
    $scope.signupModal.show();
  }

  $scope.signup = function(){

  }
}) //Controls Pulling Items from Category group in database
.factory('Category', function($http){
    var category = {
      list: [],
      companies: []
    };

    category.getAll = function(){
      return $http({
        method: 'GET',
        url: "https://myfayettecounty-c7877.firebaseio.com/categories.json"
      }).success(function(data){
        category.list = data;
      });
    }

    category.getCompanyByCategory = function(params){
      return $http({
        method: 'GET',
        url: `https://myfayettecounty-c7877.firebaseio.com/companies.json?orderBy="category"&equalTo="${params}"`
      }).success(function(data){
        category.companies = data;
      });
    }

    category.getCompanyByName = function(params){
      return $http({
        method: 'GET',
        url: `https://myfayettecounty-c7877.firebaseio.com/companies.json?orderBy="name"&equalTo="${params}"`
      }).success(function(obj){
        category.companies = obj;
      });
    }
  return category;
}) //Controls Events in Database
.factory('event', function($http){
  var events = {
    list: []
  };

  events.getAll = function(){
    return $http({
      method: 'GET',
      url: `https://myfayettecounty-c7877.firebaseio.com/events.json`
    }).success(function(data){
        events.list = data;
    });
  }

  events.addEvent = function(eventObj){
    return new Promise((resolve, reject)=>{
      $http.post(`https://myfayettecounty-c7877.firebaseio.com/events.json`, angular.toJson(eventObj))
      .then(function(data){
        resolve(data);  
      })
      .catch(function(error){
        reject(error);
      });
    });
  }

  return events;
})
.controller('HomeCtrl', function($scope) {
 
})
.controller('ListingCtrl', function($scope, Category) {
    Category.getAll().then(function(data){
      $scope.categories = Category.list;
    });

})
.controller('DetailsCtrl', function($scope, $stateParams, Category) {
    $scope.title = $stateParams.category;
    Category.getCompanyByCategory($stateParams.category)
    .then(function(obj){
      $scope.companies = obj.data;
    });
})
.controller('CompaniesCtrl', function($scope, $stateParams, Category) {
  $scope.title = $stateParams.company;
  Category.getCompanyByName($stateParams.company)
  .then(function(obj){
    for (var prop in obj.data){
    $scope.company = obj.data[prop];
    }
  });

})
.controller('AccountCtrl', function($scope, $stateParams) {
})
.controller('FavoritesCtrl', function($scope, $stateParams) {
})
.controller('CalendarCtrl', function($scope, event, $ionicModal) {
  $scope.eventSources = [{
    events: []
  }];
  $scope.events = {};
      $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: function(event){
          $ionicModal.fromTemplateUrl('templates/event_info.html', {
          scope: $scope,
          }).then(function(modal){
            $scope.event = [event];
            $scope.eventmodal = modal;
            $scope.eventmodal.show();
          })
          $scope.close = function(){
            $scope.eventmodal.hide();
          }
        }
      }
    };
  event.getAll().then(function(obj){
    obj.data.forEach(function(i){
      $scope.eventSources[0].events.push(i); 
    })
  });
})
.controller('SubmissionCtrl', function($scope, $stateParams, event, $location) {
  $scope.eventObj = {
    title: 'Random',
    start: '15:00',
    end:'16:00',
    location: 'Oakland',
    hosted_by: 'Oakland Chamber of Commerce',
    price: 'Free',
    ages: '18+',
    contact: 'email@g.com',
    url: '',
    description: 'Monthly networking lunch',
    date: '2017-05-25',
    editable: false,
    allDay: false,
  }


//FUNCTION WORKS: NEED TO DEBUG RETRIEVE FUNCTION ON CALENDAR PAGE//

  // $scope.submit = function(){
  //   $scope.eventObj.start = $scope.eventObj.date + "T" + $scope.eventObj.start
  //   $scope.eventObj.end = $scope.eventObj.date + "T" + $scope.eventObj.end
  //   event.addEvent($scope.eventObj)
  //   .then(function(obj){
  //     alert("event added");
  //     window.location.href("#/app/events")
  //   })
  // }

})
.controller('AboutCtrl', function($scope, $stateParams) {
})
.controller('AdvertiseCtrl', function($scope, $stateParams) {
})
.controller('MapCtrl', function($scope, $stateParams) {
});
