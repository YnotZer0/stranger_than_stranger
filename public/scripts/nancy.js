'use strict';

//these are currently global variables - should really move into a Service
var ENV             = "dev";
var HTTPType        = "http://";  //"https://"   //switch over when working locally(HTTP) or Bluemix(HTTPS)
var HTTPPort        = "6012"; //"443"; //"6012"; //when running locally on localhost
var RESTAPIPort     = "6012"; //"443"; //"6012"; //when running locally on localhost
var RESTAPIVersion  = "/v1";
var hostname        = "localhost"; //"strangerthan-strangerthings.eu-gb.mybluemix.net"; //localhost";

//var socketInterval; //object used for the SetInterval polling
//var refreshInterval = 60000;

//-------------------------------------------------------------------------------------------------------------------//
// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.net/how-to/javascript

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
   date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function() {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  return date.getFullYear();
}
//-------------------------------------------------------------------------------------------------------------------//

var myStrangerThingsApp = angular.module('myStrangerThingsApp',[
    'ngRoute',
//    'googlechart',
//    'charts.ng.justgage',
    'ngDialog'
////    'mobile-angular-ui'
    ])

.config(function($routeProvider) {
    $routeProvider
//    .when('/', {
//        templateUrl: "views/home.html",
//        access: {restricted: true}
//    })
    .when('/login', {
        templateUrl: "views/login.html",
        controller: 'LoginCtrl',
        access: {restricted: false}
    })
    .when('/logout', {
        controller: 'LogoutCtrl',
        access: {restricted: true}
    })
    .when('/pollywog_mainpage', {
        templateUrl: "views/pollywog_mainpage.html",
        controller: 'PWMainPageCtrl',
        access: {restricted: true}
    })
    .when('/demon_mainpage', {
        templateUrl: "views/demon_mainpage.html",
        controller: 'DEMainPageCtrl',
        access: {restricted: true}
    })
    .when('/pollywog_page1', {
        templateUrl: "views/pollywog_page1.html",
        controller: 'PWPage1Ctrl',
        access: {restricted: true}
    })
    .when('/demon_page1', {
        templateUrl: "views/demon_page1.html",
        controller: 'DEPage1Ctrl',
        access: {restricted: true}
    })
    .when('/pollywog_page2', {
        templateUrl: "views/pollywog_page2.html",
        controller: 'PWPage2Ctrl',
        access: {restricted: true}
    })
    .when('/demon_page2', {
        templateUrl: "views/demon_page2.html",
        controller: 'DEPage2Ctrl',
        access: {restricted: true}
    })
    .when('/sharedPage1', {
        templateUrl: "views/sharedPage1.html",
        controller: 'SharedPage1Ctrl',
        access: {restricted: true}
    })
    .when('/sharedPage2', {
        templateUrl: "views/sharedPage2.html",
        controller: 'SharedPage2Ctrl',
        access: {restricted: true}
    })
    .otherwise({
      redirectTo: '/login'
    });
});

//not using socket.io in this sample app
//myStrangerThingsApp.run(function ($rootScope, $location, $route, AuthService, socket) {
myStrangerThingsApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',function (event, next, current) {

//you can safely ignore the next.access angularJS error you see in the web browser console - it does not prevent from working

    //if we change route/page then we need to kill any existing setInterval Timers
    //again, only relevant if using socket.io (teaser!)
//    if(socketInterval) {
//console.log("clearInterval");
//      clearInterval(socketInterval);
//    }

//extracts out from the route object above the .access.restricted value of the page you want to go to next
//console.log(next.access.restricted);

		AuthService.getUserStatus()
		.then(function(){
  		if (next.access.restricted && !AuthService.isLoggedIn()){
				$location.path('/login');
				$route.reload();
			}
		});
	});
});
