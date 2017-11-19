
//We're not using socket.io in this sample....(anymore)
//Getting value from server data change event
/*
mySVSI.factory('socket', function($rootScope) {
	var socket = io.connect(); // Connection to the server socket
//	var socket = io.connect('http://localhost:6006'); // Connection to the server socket
	console.log("connected to io socket server");

	return {
		on: function(eventName, callback) { // Return callback to the actual function to manipulate it.
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
	};
});
*/

angular.module('myStrangerThingsApp').factory('AuthService', ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {
    // create user variable
    var user = null;
    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout
    });

    function isLoggedIn() {
//console.log("isLoggedIn");
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function getUserStatus() {
console.log("getUserStatus");
      return $http.get('/statusMe')
      // handle success
      .success(function (data) {
        if(data.status){
          user = true;
        } else {
          user = false;
        }
console.log("user="+user);
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }

    function login(username, password) {
console.log("login u="+username);
console.log("login p="+password);
      // create a new instance of deferred
      var deferred = $q.defer();
      // send a post request to the server
      $http.post('/loginMe',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
//console.log("success="+data+":"+status);
					typeOfUser = user.type;
          if(status === 200 && data.status){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
//console.log("error="+data);
          user = false;
          deferred.reject();
        });
      // return promise object
      return deferred.promise;
    }

    function logout() {
//console.log("logout");
      // create a new instance of deferred
      var deferred = $q.defer();
      // send a get request to the server
      $http.get('/logoutMe')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });
      // return promise object
      return deferred.promise;
    }
}]);
