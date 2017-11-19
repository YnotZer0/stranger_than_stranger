'use strict';

myStrangerThingsApp.controller('CustomNavCtrl', function($scope, $location, $http) {

  $scope.redirect = function (whereTo) {
    // call REST API first to see what type of user - but only after we are logged in
    var url = HTTPType+hostname+':'+RESTAPIPort+RESTAPIVersion+'/userType';
    $http.get(url).success(function(data) {
console.log(data);
      if(data == "") {
        //user not logged in yet
        $location.path('/login');
      } else {
        $scope.prefix = data;
        var redirect = data + whereTo;
console.log("redirect="+redirect);
        $location.path(redirect);
      }
    });
  };

});
