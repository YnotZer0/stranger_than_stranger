'use strict';
//-------------------------------------------------------------------------------------------------------------------//

//myStrangerThingsApp.controller('PWMainPageCtrl', function($scope, $location, $http, socket, ngDialog, $window) {
myStrangerThingsApp.controller('PWMainPageCtrl', function($scope, $location, $http, $window) {
console.log("PWMainPageCtrl:",$scope);

	$scope.sensorsdata 						= [];

	$scope.temp 									= 50;
	$scope.humd 									= 90;
	$scope.demidogs 							= [];

	var myDate 										= new Date();
	var week 											= myDate.getWeek();
	var nowHour 									= myDate.getUTCHours();
//console.log("week="+week);
	$scope.weekNum 								= myDate.getWeek(); //48;
	$scope.dayNum  								= myDate.getUTCDay();  //1,2,3,4,5
	$scope.time 									= nowHour; //12
	$scope.bookedby								= "millie";

	$scope.characterName					= "Mike";  //Millie has a long way to go before she gets to be Eleven

//-------------------------------------------------------------------------------------------------------------------//
$scope.callServerRESTAPI = function(which) {
//which is passed, bu not used (yet)

		var data = JSON.stringify({
			'bookedby': $scope.bookedby,
			'weekNum': $scope.weekNum,
			'dayNum': $scope.dayNum
		});
		var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
		var url = HTTPType+hostname+':'+RESTAPIPort+RESTAPIVersion+'/performSomeThingServerSide';
		//look inside hopper.js to find the REST API, input params and output params

		$http.post(url, data, headers).success(function(data) {
console.log("reply success="+data[0].success);

			$window.alert("The REST API call was successful for you, "+$scope.bookedby);

		}).error(function() {
		console.log("ERROR doing POST to /v1/performSomeThingServerSide");

			$window.alert("There was an issue invoking the Upside Down.  Please try again later.");
		});
};
//-------------------------------------------------------------------------------------------------------------------//

//-------------------------------------------------------------------------------------------------------------------//
$scope.searchTheLab = function(whichFloor) {
console.log("whichFloor="+whichFloor);
	$scope.demidogs = [];
	$scope.apply;

	//now perform a REST API call lookup
	//and update some values on the UI accordingly
	var returnedsensordata = [];
	//call REST API passing which character
	var url = HTTPType+hostname+':'+RESTAPIPort+RESTAPIVersion+'/summonTheMonster/'+$scope.characterName;
console.log("url="+url);

	$http.get(url).success(function(data) {
		returnedsensordata = data;
		//check .length just incase do not get a result returned
		for(var i=0; i <returnedsensordata.length; i++) {
			$scope.demidogs[i] 	= returnedsensordata[i].demidog;
console.log("demidogs are chasing you!");
		}
		$window.alert("You awoke the demidogs....there are "+returnedsensordata.length+" chasing you.");

		$scope.demidogText = "You are being chased by these demidogs...";
		//now reflect change in UI
		$scope.apply;
	});
};

//------------------------------------------------------------------------------------------------------------------//

    $scope.onLoad = function() {
//        console.log("MainPageCtrl loaded");
				$scope.searchTheLab(0); //let's start searching on the ground floor
				$scope.callServerRESTAPI(); //we should call this when invoked from a button press
    };

//-------------------------------------------------------------------------------------------------------------------//

/***************************************/
	//called when controller is started (when page is loaded/refreshed)
    $scope.onLoad();
/***************************************/

});
