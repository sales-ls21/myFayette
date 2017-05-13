angular.module('golocal.services', [])
.factory('Auth', function(){

   var isAuthenticated = function(){
    return new Promise((resolve, reject) =>{
      firebase.auth().onAuthStateChanged((user)=>{
        if (user){
          console.log("who is it?", user.uid);
          currentUser = user.uid;
          resolve(true);
        } else{
          console.log("not logged in");
          resolve(false);
        }
      });
    });
  };

  var getUser = function(){
    return currentUser;
  };

  return {isAuthenticated, getUser};
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
