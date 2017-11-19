'use strict';
//-------------------------------------------------------------------------------------------------------------------//

myStrangerThingsApp.controller('SharedPage1Ctrl', function($scope, $location, $http, $window) {

$scope.noAccess = function() {

  $window.alert("As you are a mere human, you are not allowed any further access.  Become enlightened to progress further...");

}

$scope.curious = function() {

  $window.alert("Come closer....I'll show you more...");

  $location.path("/sharedPage2");
}

//-------------------------------------------------------------------------------------------------------------------//

    $scope.onLoad = function() {
        console.log("SharedPage1Ctrl loaded");
    };

//-------------------------------------------------------------------------------------------------------------------//

/***************************************/
	//called when controller is started (when page is loaded/refreshed)
    $scope.onLoad();
/***************************************/

});
