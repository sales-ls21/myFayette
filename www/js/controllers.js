angular.module('golocal.controllers', [])
.controller('AppCtrl', function($ionicHistory, $scope, $ionicModal, $timeout, $http) {
  var currentUser = null;

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

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(data){
      $scope.closeLogin();
      currentUser = data.uid;
      window.location.replace('#/app/favorites')
    });
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

 $scope.signup = function(name, email, password){
  return firebase.auth().createUserWithEmailAndPassword(email, password).
  then(function(data){
    $scope.closeSignUp();
    currentUser = data.uid;
    userObj = {
      name: name,
      uid: currentUser
    }
    return $http({
      method: 'POST',
      url: "https://myfayettecounty-c7877.firebaseio.com/users.json",
      data: userObj
    }).success(function(data){
      window.location.replace('#/app/favorites')
      // $state.go('app.favorites')
    })
  })
 };

 $scope.logout = function(){
      firebase.auth().signOut().then(function(data){
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
      currentUser = null;
      window.location.replace('#/app/home')
      })
 }
  
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
.controller('CompaniesCtrl', function($scope, $stateParams, Category, Auth, $location) {
  $scope.title = $stateParams.company;
  Category.getCompanyByName($stateParams.company)
  .then(function(obj){
    for (var prop in obj.data){
    $scope.company = obj.data[prop];
    }
  });

  $scope.saveToFav = function(){
    let data = null;
    Auth.isAuthenticated().then(function(data){
      if(!data){
        alert('You must be logged in to add favorites.');
      } else{
        data = data;
        Category.getCompanyByName($stateParams.company)
        .then(function(obj){
          for(var prop in obj.data){
            obj.data = obj.data[prop]
          }
          var name = obj.data.name;
          Category.Favorite(data, name)
          .then(function(item){
            alert("Added to Favorites.");
          });
        });
      }
    })
  }
})
.controller('AccountCtrl', function($scope, $stateParams, Auth, User, $location) {
  let user = null;
  $scope.accountDetails = {};
  Auth.isAuthenticated().then(function(data){
    if(!data){
      $scope.accountDetails.message = "In order to view account details, you must be logged in."
    } else {
      user = data;
      User.getUserDetails(user).then(function(obj){
        $scope.accountDetails = obj.data;
      })
    }
  })

  $scope.edited = {
    name: null
  }

  $scope.editDetails = function(){
    Auth.getUser().then(function(data){
      User.editDetails(data, $scope.edited).then(function(data){
        alert("Account updated.");
        window.location.replace('#/app/account');
      })
    })
  }

  $scope.delete = function(){
    Auth.getUser().then(function(data){
      User.deleteAccount(data)
      .then(function(obj){
        alert("Your account has been successfully deleted.");
        $location.url('/home');
      })
    })
  }

})
.controller('FavoritesCtrl', function($scope, $stateParams, Favorites, Auth) {

   $scope.$on('$ionicView.enter', function(e) {
      let user = null;
      Auth.isAuthenticated().then(function(data){
        if(!data){
            window.location.replace("#/app/home");
            alert('You must be logged in to see favorites.');
          } else {
            user = data;
            Favorites.getByUser(user)
            .then(function(result){
              $scope.favorites = Favorites.list;
            })
          }
      }) 
  });
})
.controller('CalendarCtrl', function($scope, event, $ionicModal, Auth, $location) {
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
          $scope.favorite = function(){
            //ADD EVENT HANDLER HERE
          }
        }
      }
    };
  event.getAll().then(function(obj){
    for(prop in obj.data){
      $scope.eventSources[0].events.push(obj.data[prop])
    }
  });

  $scope.checkUser = function(){
    Auth.isAuthenticated().then(function(data){
      if(!data){
        alert('Please log in to add your event.');
        $location.url('/home');
      } else {
        $location.url('/submit_event')
      }
    })
  }
})
.controller('SubmissionCtrl', function($scope, $stateParams, event, $location, Auth) {
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
      user: null
    }
   $scope.$on('$ionicView.enter', function(e) {
      let user = null;
      Auth.isAuthenticated().then(function(data){
        if(!data){
            alert('You must be logged in order to submit an event to the calendar.');
            $location.url("/home");
          } else {
            $scope.eventObj.user = data;
          }
      }) 
  });
  $scope.submit = function(){
    $scope.eventObj.start = $scope.eventObj.date + "T" + $scope.eventObj.start
    $scope.eventObj.end = $scope.eventObj.date + "T" + $scope.eventObj.end
    event.addEvent($scope.eventObj)
    .then(function(obj){
      alert("event added");
      $location.url("/events")
    })
  }
})
.controller('AboutCtrl', function($scope, $stateParams) {
})
.controller('AdvertiseCtrl', function($scope, $stateParams) {
})
.controller('MapCtrl', function($scope, $stateParams, ConfigGoogle) {
});
