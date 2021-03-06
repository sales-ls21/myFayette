angular.module('golocal.services', [])
.factory('Auth', function(){

   var isAuthenticated = function(){
    return new Promise((resolve, reject) =>{
      firebase.auth().onAuthStateChanged((user)=>{
        if (user){
          currentUser = user.uid;
          resolve(currentUser);
        } else{
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

    category.Favorite = function(id, name){
    	return new Promise((resolve, reject)=>{
    		$http.get(`https://myfayettecounty-c7877.firebaseio.com/users.json?orderBy="uid"&equalTo="${id}"`)
    		.then(function(obj){
    			let user = id;
    			let favObj = {
    				uid: user,
    				business: name,
    				id: Math.floor(Math.random() * 5000)
    			}
				$http.post(`https://myfayettecounty-c7877.firebaseio.com/favorites.json`, angular.toJson(favObj))
				.then(function(returned){
					resolve(returned);
				}).catch(function(error){
					reject(error);
				});
    		});
    	}).catch(function(error){
    		reject(error);
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
.factory('Favorites', function($http){
	var favorites = {
		list: []
	}

	favorites.getByUser = function(uid){
		return $http({
	      method: 'GET',
	      url: `https://myfayettecounty-c7877.firebaseio.com/favorites.json?orderBy="uid"&equalTo="${uid}"`
	    }).success(function(data){
	        favorites.list = data;
	    });
	}
	return favorites;
})
.factory('User', function($http){
	var user = [];

	user.getUserDetails = function(uid){
		return $http({
			method: 'GET',
			url: `https://myfayettecounty-c7877.firebaseio.com/users.json?orderBy="uid"&equalTo="${uid}"`
		}).success(function(data){
			user.push(data);
		});
	}

	user.deleteAccount = function(uid){
		return $http({
			method: 'DELETE',
			url: `https://myfayettecounty-c7877.firebaseio.com/users.json?orderBy="uid"&equalTo="${uid}"`
		}).success(function(data){

		})
	}

	user.editDetails = function(uid, dataObj){
		return $http({
			method: 'PATCH',
			url: `https://myfayettecounty-c7877.firebaseio.com/users.json?orderBy="uid"&equalTo="${uid}"`,
			data: dataObj
		}).success(function(data){
			user.push(data);
		})
	}
	return user;
})

