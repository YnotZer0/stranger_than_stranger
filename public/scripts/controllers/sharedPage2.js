'use strict';
//-------------------------------------------------------------------------------------------------------------------//

myStrangerThingsApp.controller('SharedPage2Ctrl', function($scope, $location, $http, $window, AuthService) {

$scope.noAccess = function() {

  $window.alert("As you are a mere human, you are not allowed any further access.  Become enlightened to progress further...");

}

$scope.everything = function() {

  $window.alert("You think you are ready for the truth.  You are not. Goodbye.");

  AuthService.logout()
    .then(function () {
      $location.path('/login');
    });

}
//-------------------------------------------------------------------------------------------------------------------//

    $scope.onLoad = function() {
        console.log("SharedPage2Ctrl loaded");
    };

//-------------------------------------------------------------------------------------------------------------------//

/***************************************/
	//called when controller is started (when page is loaded/refreshed)
    $scope.onLoad();
/***************************************/

});
