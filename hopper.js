/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

//adding the Bluemix Single Sign-On walkthrough is here:
//https://console.ng.bluemix.net/docs/services/SingleSignOn/configure_apps.html#tsk_creatingapps
//

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
// create a new favicon
//var favicon = require('serve-favicon');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
// ibm_db needed for access to DASHDB
//
//https://www.npmjs.com/package/ibm_db
//
//IBM DB2 NODEJS DRIVER API
//
//might need to use the Pooling aspect of this when load increases
//will leave this here for now as it'll show you how to use a DB from nodeJS too
//var ibmdb = require('ibm_db');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// passport login libraries
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

//var connString = "DRIVER={DB2};DATABASE=" + "BLUDB" + ";UID=" + "dash108214" + ";PWD=" + "8E1VJGfirjts" + ";HOSTNAME=" + "yp-dashdb-small-01-lon02.services.eu-gb.bluemix.net" + ";port=" + "50000";

//var auth = function(req, res, next) {
//  if(!req.isAuthenticated())
//    res.send(401);
//  else
//    next();
//}
// create a new express server
var app = express();

//START - added following for HTTPS
//**************************************************************************
//to run this locally, you need to comment out this section as you cannot
//run HTTPS from your own machine, only from Bluemix
//**************************************************************************
//
// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See
// http://expressjs.com/api#app-settings for more details.

//uncomment when running on Bluemix
//////////////app.enable('trust proxy');

// Add a handler to inspect the req.secure flag (see
// http://expressjs.com/api#req.secure). This allows us
// to know whether the request was via http or https.

//uncomment when running on Bluemix
/*
app.use (function (req, res, next) {
        if (req.secure) {
                // request was via https, so do no special handling
                next();
        } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
        }
});
*/
//END - added following for HTTPS


//assign favicon
//app.use(favicon(__dirname + '/public/favicon.ico'));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
// configure passport
var db = require('./db');
var userType = "";  //pollywog_ or demon_ //not used now, but could be used to identify different user types and change functionality accordingly

//In the future, you could Swap out the following with Bluemix SingleSignOn service
//it's built on the same approach
//https://www.ibm.com/blogs/bluemix/2015/02/easily-secure-access-bluemix-apps-with-sso/
//https://console.ng.bluemix.net/docs/services/SingleSignOn/configure_apps.html#tsk_creatingapps
//and here's the code changes you need to make:
//https://console.ng.bluemix.net/docs/services/SingleSignOn/configure_apps.html#tsk_configuringnodejsapp_express4
passport.use(new localStrategy(
  function(username, password, cb) {
console.log("inside passport.use");
/*
      if (username === "admin" && password === "admin") // simple example
      {
        user = true;
        return cb(null, user);
      }
  }
));
*/
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
console.log(user);
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      //grab the type of user here as we shall use this to determine which UI screens to reditect to
      userType = user.type;
console.log("userType="+userType);
      return cb(null, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('js',__dirname + '/js');
app.set('scripts',__dirname + '/scripts');
app.set('css',__dirname + '/css');
app.set('fonts',__dirname + '/fonts');
app.set('images',__dirname + '/images');




// Define routes.
app.post('/loginMe', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
//console.log(err); //null
//console.log(user);//false
//console.log(info);//{ message: 'Missing credentials' }
    if (err) {
      return next(err);
    }
    //if user = false
    if (!user) {
//console.log("error 401 in loginMe");
      return res.status(401).json({
        err: info
      });
    } else {
      //user = true
console.log("user logged in okay");
    }
    req.logIn(user, function(err) {
//console.log("req.logIn="+user+":"+err);
      if (err) {
//console.log("err="+err); //could not serialize user into session
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      //all is good
      res.status(200).json({
        status: 'Login successful!'
      });
    });

  })(req, res, next);
});

app.get('/logoutMe', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

app.get('/statusMe', function(req, res) {
console.log("statusMe")
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});

app.get('/v1/userType',function(request,response) {
console.log("/v1/userType="+userType);
  response.send(userType);
});

/*
// tester API to make sure that the server is listening
*/
app.get('/v1/api',function(request,response) {
  if (request.isAuthenticated()) {
    //http://www.thisisyourbible.co.uk/index.php?page=questions&task=show&mediaid=819
    response.send('You may now go behind the veil...');
  } else {
    response.send('You have not logged in yet. No access for you!')
  }
});


/*
// API call:  /v1/performSomeThingServerSide/
// input   :  'tony','49','3'
// output  :  a JavaScript array (JSON) containing whether the action was successful
*/
app.post('/v1/performSomeThingServerSide',function(request,response) {
  var returnedsensordata = [];
console.log("REST API called: performSomeThingServerSide")

  if (request.isAuthenticated()) {
    var bookedby = request.body.bookedby; //"tony";
    var weekNum = request.body.weekNum; //47/48/49/50
    var dayNum = request.body.dayNum; //1,2,3,4,5

console.log("POST params="+bookedby+" : "+weekNum+" : "+dayNum);
    //we can now do anything we want as we are on the server-side
    //we could just do some business logic coding
    //or we could call another REST API ourselves
    //why would we do that here instead of directly from the web-browser app?
    //obfuscia....obscus....ob...darn it! that word.  basically, we can make a call to here from the user
    //then from here we have the power to control what we call, how we call and it is hidden from the user
    //we can switch this out to call something different or change the logic without the user knowing

//for this example, let's call another REST API from here
    var err = false;

      if ( !err ) {
          returnedsensordata.push( {
              "success":  "true"
          });
          response.send(returnedsensordata);
      } else {
         response.send("error occurred " + err.message);
      }

  } else {
    //actually should just send back an empty object
    response.send(returnedsensordata);
  }

});

/*
// API call:  /v1/summonTheMonster/Eleven
// input   :  Eleven or Mike
// output  :  a JavaScript array (JSON) containing
*/
app.get('/v1/summonTheMonster/:characterName',function(request,response) {
  var returnedsensordata = [];
console.log("REST API called: summonTheMonster");

  if (request.isAuthenticated()) {
    var whoChallengesTheMonster = request.params.characterName; //Eleven
console.log("REST API called: summonTheMonster="+whoChallengesTheMonster);

    var demidog = 0;
    if(whoChallengesTheMonster == "Eleven") {
      demidog = Math.floor((Math.random() * 10) + 1); //return between 1-10
    } else {
      demidog = Math.floor((Math.random() * 3) + 1); //return between 1-3
    }
console.log("demidog="+demidog);

    //let's create a random amount of demidogs
    for (var i=0; i<demidog; i++) {
      returnedsensordata.push( {
          "demidog":  "demidog"+i   //demidog1, demidog2....
      });
    }
    response.send(returnedsensordata);
  } else {
    //actually should just send back an empty object
    response.send(returnedsensordata);
  }

});








// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start HTTP web server on the specified port and binding host
var server = app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});






/*
// API call:  /v1/restaurant/average/48
// input   :  weekNum value
// output  :  a JavaScript array (JSON) containing the DashDB data

app.get('/v1/restaurant/:type/:weekNum',function(request,response) {
  var returnedsensordata = [];

  if (request.isAuthenticated()) {
    var type = request.params.type;
    var weekNum = request.params.weekNum;
    if(type == "average") {
      var prevWeekNum = weekNum - 1; //we could do a SQL Statement here to get MIN/MAX and use the values in the SQL
      if(weekNum == 1) { prevWeekNum = 53 }; //just handle the scenario if we roll over the end of the year in the PoC
      var prevprevWeekNum = prevWeekNum - 1;
      var prevprevprevWeekNum = prevprevWeekNum - 1;
    }
    var sqlQuery = "SELECT AVG(T800) AS T800,AVG(T815) AS T815,AVG(T830) AS T830,AVG(T845) AS T845,";
    sqlQuery += "AVG(T900) AS T900,AVG(T915) AS T915,AVG(T930) AS T930,AVG(T945) AS T945,";
    sqlQuery += "AVG(T1000) AS T1000,AVG(T1015) AS T1015,AVG(T1030) AS T1030,AVG(T1045) AS T1045,";
    sqlQuery += "AVG(T1100) AS T1100,AVG(T1115) AS T1115,AVG(T1130) AS T1130,AVG(T1145) AS T1145,";
    sqlQuery += "AVG(T1200) AS T1200,AVG(T1215) AS T1215,AVG(T1230) AS T1230,AVG(T1245) AS T1245,";
    sqlQuery += "AVG(T1300) AS T1300,AVG(T1315) AS T1315,AVG(T1330) AS T1330,AVG(T1345) AS T1345,";
    sqlQuery += "AVG(T1400) AS T1400,AVG(T1415) AS T1415,AVG(T1430) AS T1430,AVG(T1445) AS T1445,";
    sqlQuery += "AVG(T1500) AS T1500,AVG(T1515) AS T1515,AVG(T1530) AS T1530,AVG(T1545) AS T1545,";
    sqlQuery += "AVG(T1600) AS T1600,AVG(T1615) AS T1615,AVG(T1630) AS T1630,AVG(T1645) AS T1645,";
    if(type == "average") {
      //let's go back to fetch the previous MONTH of data
      sqlQuery += "AVG(T1700) AS T1700 FROM DASH108214.YFOOTFALLAVG WHERE WEEKNUM IN ('"+prevprevprevWeekNum+"','"+prevprevWeekNum+"','"+prevWeekNum+"','"+weekNum+"');";
    } else {
      sqlQuery += "AVG(T1700) AS T1700 FROM DASH108214.YFOOTFALLAVG WHERE WEEKNUM = '"+weekNum+"';";
    }
    ibmdb.open(connString, function(err, conn) {
        if (err ) {
         response.send("error occurred " + err.message);
        }
        else {
          conn.query(sqlQuery, function(err, result, moreResultSets) {
            if ( !err ) {
                for (var i=0; i<result.length; i++) {
                    returnedsensordata.push( {
                        "t800": Number(result[i].T800).toFixed(0),
                        "t815": Number(result[i].T815).toFixed(0),
                        "t830": Number(result[i].T830).toFixed(0),
                        "t845": Number(result[i].T845).toFixed(0),
                        "t900": Number(result[i].T900).toFixed(0),
                        "t915": Number(result[i].T915).toFixed(0),
                        "t930": Number(result[i].T930).toFixed(0),
                        "t945": Number(result[i].T945).toFixed(0),
                        "t1000": Number(result[i].T1000).toFixed(0),
                        "t1015": Number(result[i].T1015).toFixed(0),
                        "t1030": Number(result[i].T1030).toFixed(0),
                        "t1045": Number(result[i].T1045).toFixed(0),
                        "t1100": Number(result[i].T1100).toFixed(0),
                        "t1115": Number(result[i].T1115).toFixed(0),
                        "t1130": Number(result[i].T1130).toFixed(0),
                        "t1145": Number(result[i].T1145).toFixed(0),
                        "t1200": Number(result[i].T1200).toFixed(0),
                        "t1215": Number(result[i].T1215).toFixed(0),
                        "t1230": Number(result[i].T1230).toFixed(0),
                        "t1245": Number(result[i].T1245).toFixed(0),
                        "t1300": Number(result[i].T1300).toFixed(0),
                        "t1315": Number(result[i].T1315).toFixed(0),
                        "t1330": Number(result[i].T1330).toFixed(0),
                        "t1345": Number(result[i].T1345).toFixed(0),
                        "t1400": Number(result[i].T1400).toFixed(0),
                        "t1415": Number(result[i].T1415).toFixed(0),
                        "t1430": Number(result[i].T1430).toFixed(0),
                        "t1445": Number(result[i].T1445).toFixed(0),
                        "t1500": Number(result[i].T1500).toFixed(0),
                        "t1515": Number(result[i].T1515).toFixed(0),
                        "t1530": Number(result[i].T1530).toFixed(0),
                        "t1545": Number(result[i].T1545).toFixed(0),
                        "t1600": Number(result[i].T1600).toFixed(0),
                        "t1615": Number(result[i].T1615).toFixed(0),
                        "t1630": Number(result[i].T1630).toFixed(0),
                        "t1645": Number(result[i].T1645).toFixed(0),
                        "t1700": Number(result[i].T1700).toFixed(0)
                    });
                }
                response.send(returnedsensordata);
            } else {
               response.send("error occurred " + err.message);
            }

            //
            //    Close the connection to the database
            //    param 1: The callback function to execute on completion of close function.
            //

            conn.close(function(){
                console.log("REST DB: Connection Closed");
                });
            });
        }
    } );

  } else {
    //actually should just send back an empty object
//    response.send('You have not logged in yet. No access for you!')
    response.send(returnedsensordata);
  }

});
*/


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


/*
// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});
*/
