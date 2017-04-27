/*
 * CS499 Spr17 - quickstart.js is a script provided by Google
 * Calendar documentation here:
 * https://developers.google.com/google-apps/calendar/quickstart/nodejs
 *
 * quickstart interacts with the google API and google auth api
 * to handle Oauth token maintenence as well as retrieving the 
 * list of events. Upon successful return, a dictionary of events is
 * created to be returned to gcalendarfetcher.js with the proper names
 * and time in order for them to be successfully broadcast
 *
*/



var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var moment = require('moment');
var promise = require('promise');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';
var eventList = [];
console.log('now in quickstart.js');

/*
 * Spr17 - Google events not retrieved before initial broadcast of 
 * calendar events, so only ICal events are being shown in first
 * interval, but they are successfully displayed during the succeeding
 * intervals. We are currently working with promises to overcome
 * this problem, but have not yet found a solution. This is the promise
 * routine we are currently using, which SHOULD make the calendar fetcher
 * halt until successfully retrieving Google events - this is not working
 * as we thought it would at the moment...still investigating
*/

// Should stop until promise is resolved?
//module.exports = function(){
  // Load client secrets from a local file.

module.exports = function(callback) {
	
//	if(arg === "no") {
		fs.readFile('modules/gCalendar/quickstart/client_secret.json', function processClientSecrets(err, content) {
			if (err) {
				console.log('Error loading client secret file: ' + err);
				return;
			}
    	// Authorize a client with the loaded credentials, then call the
    	// Google Calendar API.
			authorize(JSON.parse(content), listEvents);
		});
//	}
//	else {	
//		if(eventList != 'undefined') {	
			console.log("RETURNED FROM QUICKSTART");
//			module.exports = eventList;
		//	return module.exports;
			callback(eventList);
//		}
//	}

}
	// Getting through this conditional with eventList = []
	// Should check if the list is empty or not
	// Will resolve and return the given value for eventList
/*	if(eventList !== []){
		console.log("Value for eventList follows."); //Debugging
		console.log(eventList); //Debugging
		console.log("eventList !== []"); // Debugging
		resolve(eventList);
	}
  else {
    // Print out the error message
    // List of events will be empty
    reject(Error("Calendar not retrieved.\n"));
  }
}*/

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	var clientSecret = credentials.installed.client_secret;
	var clientId = credentials.installed.client_id;
	var redirectUrl = credentials.installed.redirect_uris[0];
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, function(err, token) {
		if (err) {
			getNewToken(oauth2Client, callback);
		} else {
			oauth2Client.credentials = JSON.parse(token);
			callback(oauth2Client);
		}
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
	var authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	console.log('Authorize this app by visiting this url: ', authUrl);
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.question('Enter the code from that page here: ', function(code) {
		rl.close();
		oauth2Client.getToken(code, function(err, token) {
			if (err) {
			console.log('Error while trying to retrieve access token', err);
			return;
		}
			oauth2Client.credentials = token;
			storeToken(token);
			callback(oauth2Client);
		});
	});
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code != 'EEXIST') {
			throw err;
		}
	}
	fs.writeFile(TOKEN_PATH, JSON.stringify(token));
	console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
	var calendar = google.calendar('v3');
	calendar.events.list({
		auth: auth,
		calendarId: 'primary',
		timeMin: (new Date()).toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime',
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
		var events = response.items;
		if (events.length == 0) {
			console.log('No upcoming events found.');
		} else {
			console.log('Upcoming 10 events:');
    	console.log('now in quickstart...');  
		
			/*
			 * Spr17 - convert returned Google events into
			 * the format (a dictionary with keys named
			 * "summary" for the event name and "startDate" for the
			 * starting time of the event, converted to "moment" time)
 	   		 * expected by the calendar fetcher
			 * in order for proper broadcasting
			*/

  //  	console.log('now in quickstart...');  
			for (var i = 0; i < events.length; i++) {
				var event = events[i];
				var start = event.start.dateTime || event.start.date;
				var startDate = moment(new Date(start));
				var now = moment(new Date());
				console.log('%s - %s', start, event.summary);
				var endDate = moment(startDate).add(1, "days");
				if (eventList.length === 0) {		
					eventList.push({
						title: event.summary,
                        startDate: startDate.format("x"),
                	  	endDate: endDate.format("x")
					});				
				}
//				console.log("Length of eventList = " + eventList.length);
				var exists = 0;
				for(var j = 0; j < eventList.length; j++) {
				//	console.log("eventList[j]: " + eventList[j].title);
				//	console.log("eventList type " + typeof(eventList[j].title));
				//	console.log("event.summary: " + event.summary);
				//	console.log("event.sum type: " + typeof(event.summary));
					if (eventList[j].title === event.summary) {
//						console.log("not equal");
						exists = 1;
						//eventList.push({
						//	title: event.summary,
						//	startDate: startDate.format("x")
						//});
					
					}
				}
				if (exists == 0 && (startDate > now)) {
					eventList.push({
						title: event.summary,
						startDate: startDate.format("x"),
	        			endDate: endDate.format("x")
					});				
				}
	  		}
			console.log(eventList);
		}
	});
//  return eventList;
}
