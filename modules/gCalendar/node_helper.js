/* Magic Mirror
 * Node Helper: Calendar
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var validUrl = require("valid-url");
var CalendarFetcher = require("./gcalendarfetcher.js");
//var quickstart = require("./quickstart/quickstart.js");

module.exports = NodeHelper.create({
	// Override start method.
	start: function() {
		var self = this;
		var events = [];

		this.fetchers = [];

		console.log("Starting node helper for: " + this.name);

	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "ADD_CALENDAR") {
			//console.log('ADD_CALENDAR: ');
			this.createFetcher(payload.url, payload.fetchInterval, payload.maximumEntries, payload.maximumNumberOfDays, payload.user, payload.pass);
		}
		else if (notification === "ADD_GOOGLECAL") {
			console.log('ADD_GOOGLECAL in node_helper\n');
			this.createFetcher(payload.url, payload.fetchInterval, payload.maximumEntries, payload.maximumNumberOfDays, payload.user, payload.pass);
//			quickstart;
		}
	},

	/* createFetcher(url, reloadInterval)
	 * Creates a fetcher for a new url if it doesn't exist yet.
	 * Otherwise it reuses the existing one.
	 *
	 * attribute url string - URL of the news feed.
	 * attribute reloadInterval number - Reload interval in milliseconds.
	 */

	createFetcher: function(url, fetchInterval, maximumEntries, maximumNumberOfDays, user, pass) {
		var self = this;

		if (!validUrl.isUri(url)) {
			self.sendSocketNotification("INCORRECT_URL", {url: url});
			return;
		}

		var fetcher;
		if (typeof self.fetchers[url] === "undefined") {
			console.log("Create new calendar fetcher for url: " + url + " - Interval: " + fetchInterval);
			fetcher = new CalendarFetcher(url, fetchInterval, maximumEntries, maximumNumberOfDays, user, pass);

			fetcher.onReceive(function(fetcher) {
				//console.log('Broadcast events.');
				//console.log(fetcher.events());

				if (url === 'https://www.googleapis.com/auth/calendar')
                	self.sendSocketNotification("GOOGLECAL_EVENTS", {
                    	url: fetcher.url(),
                    	events: fetcher.events()
                	});
				else
					self.sendSocketNotification("CALENDAR_EVENTS", {
						url: fetcher.url(),
						events: fetcher.events()
					});
			});

			fetcher.onError(function(fetcher, error) {
				self.sendSocketNotification("FETCH_ERROR", {
					url: fetcher.url(),
					error: error
				});
			});

			self.fetchers[url] = fetcher;
		} else {
			//console.log('Use existing news fetcher for url: ' + url);
			fetcher = self.fetchers[url];
			fetcher.broadcastEvents();
		}

		fetcher.startFetch();
	}
});
