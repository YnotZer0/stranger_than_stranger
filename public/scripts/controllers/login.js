'use strict';

myStrangerThingsApp.controller('LoginCtrl', function($scope, $location, $http, AuthService) {

  $scope.login = function () {

        // initial values
        $scope.error    = false;
        $scope.disabled = true;
        $scope.mainpage = "mainpage";
        $scope.prefix   = "/";
        $scope.redirect = "/";
console.log("login");

        // call login from service
        AuthService.login($scope.loginForm.username, $scope.loginForm.password)
          // handle success
          .then(function () {
//console.log("success");
            //call REST API to get userType value
            var url = HTTPType+hostname+':'+RESTAPIPort+RESTAPIVersion+'/userType';
console.log("url="+url);
        	  $http.get(url).success(function(data) {
console.log(data);
              $scope.prefix = data;
              $scope.redirect = $scope.prefix + $scope.mainpage;
console.log("$scope.redirect="+$scope.redirect);

              //this needs to be dynamically set depending on who logged in
              //user.typeOfUser determine which page to navigate to
              $location.path($scope.redirect);
              $scope.disabled = false;
              $scope.loginForm = {};
        		});
            //just incase we drop through
            $scope.disabled = false;
            $scope.loginForm = {};
          })
          // handle error
          .catch(function () {
//console.log("catch");
            $scope.error = true;
            $scope.errorMessage = "Invalid username and/or password - please try again";
            $scope.disabled = false;
            $scope.loginForm = {};
          });
  };

});

myStrangerThingsApp.controller('LogoutCtrl', function($scope, $location, $http, AuthService) {
  $scope.logout = function () {
        // call logout from service
        AuthService.logout()
          .then(function () {
            $location.path('/login');
          });

      };
});
