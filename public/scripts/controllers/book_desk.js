'use strict';
//-------------------------------------------------------------------------------------------------------------------//
myStrangerThingsApp.controller('bookDeskCtrl', function($scope) {

  $scope.interval = 15;

  var nowDate = new Date();
  var nowHour = nowDate.getUTCHours();
//console.log("nowHour="+nowHour); //18

  $scope.time = nowHour; //12
  $scope.UItime = $scope.time+":00";

  $scope.increaseTime = function() {
    $scope.time += $scope.interval/60;
//console.log("$scope.time"+$scope.time);
    var input = $scope.time;
    var hours = Math.floor(input);
    input = (input - hours) * 60;
    var mins =  Math.floor(input);
    var secs = (input - mins) * 60;
    //logic not adding the extra 0 to the mins....
    mins = (mins < 10 && mins >= 0) ? '0' + mins : mins;
//console.log("mins="+mins);
    $scope.UItime = hours + ":" + mins;
  }

  $scope.decreaseTime = function() {
    $scope.time -= $scope.interval/60;
//console.log("$scope.time"+$scope.time);
    var input = $scope.time;
    var hours = Math.floor(input);
    input = (input - hours) * 60;
    var mins =  Math.floor(input);
    var secs = (input - mins) * 60;
//console.log("mins="+mins);
    mins = (mins < 10 && mins >= 0) ? '0' + mins : mins;
    $scope.UItime = hours + ":" + mins;
  }

});
