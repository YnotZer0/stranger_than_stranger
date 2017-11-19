'use strict';
//-------------------------------------------------------------------------------------------------------------------//

myStrangerThingsApp.controller('PWPage2Ctrl', function($scope, $location, $http, $window) {


$scope.noAccess = function() {

  $window.alert("As you are a mere Pollywog, you are not allowed any further access.  Become a Demon to progress further...");

}

//-------------------------------------------------------------------------------------------------------------------//

    $scope.onLoad = function() {
        console.log("PWPage2Ctrl loaded");
    };

//-------------------------------------------------------------------------------------------------------------------//

/***************************************/
	//called when controller is started (when page is loaded/refreshed)
    $scope.onLoad();
/***************************************/

});
