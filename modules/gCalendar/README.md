# Module: gCalendar
The `gCalendar` module is expanding upon the default calendar module of the MagicMirror.
This module displays events from a public .ical calendar as well as allowing a user to have their private Google Calendar events pulled and merged to the pre-existing .ical calendar events.

## Using the module
First, the user should visit the Google Calendar API Node.js quickstart (https://developers.google.com/google-apps/calendar/quickstart/nodejs) and complete steps 1 and 2. 

Step 1 will have the user sign into the Google API Console and retrieve a file called `client_secret.json`. Put this file in `modules/gCalendar/quickstart/client_secret.js`.

**NOTE** on subsequent uses, if you create a different client_secret.js file, you will need to remove the old credentials file located in
`~/.credentials/calendar-nodejs-quickstart.json`, otherwise you will receive an 'unauthorized_client' error


Step 2 will have the user install the Google API library and the Google Auth library. 


From your Magic Mirror root directory there is a file named `config/config.js.sample`. Copy this file to a file named `config.js`, also in the config folder, otherwise Magic Mirror will not launch correctly. 

The default `config/config.js` gCalendar file should appear like this:
```javascript
modules: [
	{
		module: 'gCalendar',
		header: 'Private Calendar',
		position: 'top_left',	// This can be any of the regions. Best results in left or right regions.
		config: {
                    	calendars: 
			[
				{
					// This is the default .ical Calendar
                        		symbol: 'calendar-check-o ',
                        		url: 'webcal://www.calendarlabs.com/templates/ical/US-Holidays.ics'
                    		},
                    		{
					// This is what is used to fetch the user's Google calendar
                        		symbol: 'caldendar-check-o ',
                        		url: 'https://www.googleapis.com/auth/calendar'
                    		}
			]	
		}
	}
]
```
Once the config file is in place, the google api and google auth libraries are installed, and you have placed your client_secret.json file in `modules/gCalendar/quickstart/`, start the Magic Mirror from its root directory. 

When first launching the module, you will see in the console a url. Copy and paste that into your browser, log in to your Google account using your username and password, and copy the code given an place that into a file named `auth.txt` in your Magic Mirror root folder. Then restart Magic Mirror or wait for the interval period to elapse (5 min by default, but can be changed in gCalendar.js) and your Google Calendar will be pulled.


## Configuration options

The following properties can be configured:


<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>maximumEntries</code></td>
			<td>The maximum number of events shown.<br>
				<br><b>Possible values:</b> <code>0</code> - <code>100</code>
				<br><b>Default value:</b> <code>10</code>
			</td>
		</tr>
		<tr>
			<td><code>maximumNumberOfDays</code></td>
			<td>The maximum number of days in the future.<br>
				<br><b>Default value:</b> <code>365</code>
			</td>
		</tr>
		<tr>
			<td><code>displaySymbol</code></td>
			<td>Display a symbol in front of an entry.<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>defaultSymbol</code></td>
			<td>The default symbol.<br>
				<br><b>Possible values:</b> See <a href="http://fontawesome.io/icons/" target="_blank">Font Awsome</a> website.
				<br><b>Default value:</b> <code>calendar</code>
			</td>
		</tr>
		<tr>
			<td><code>maxTitleLength</code></td>
			<td>The maximum title length.<br>
				<br><b>Possible values:</b> <code>10</code> - <code>50</code>
				<br><b>Default value:</b> <code>25</code>
			</td>
		</tr>
		<tr>
			<td><code>fetchInterval</code></td>
			<td>How often does the content needs to be fetched? (Milliseconds)<br>
				<br><b>Possible values:</b> <code>1000</code> - <code>86400000</code>
				<br><b>Default value:</b> <code>300000</code> (5 minutes)
			</td>
		</tr>
		<tr>
			<td><code>animationSpeed</code></td>
			<td>Speed of the update animation. (Milliseconds)<br>
				<br><b>Possible values:</b><code>0</code> - <code>5000</code>
				<br><b>Default value:</b> <code>2000</code> (2 seconds)
			</td>
		</tr>
		<tr>
			<td><code>fade</code></td>
			<td>Fade the future events to black. (Gradient)<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>fadePoint</code></td>
			<td>Where to start fade?<br>
				<br><b>Possible values:</b> <code>0</code> (top of the list) - <code>1</code> (bottom of list)
				<br><b>Default value:</b> <code>0.25</code>
			</td>
		</tr>
		<tr>
			<td><code>calendars</code></td>
			<td>The list of calendars.<br>
				<br><b>Possible values:</b> An array, see <i>calendar configuration</i> below.
				<br><b>Default value:</b> <i>An example calendar.</i>
			</td>
		</tr>
		<tr>
			<td><code>titleReplace</code></td>
			<td>An object of textual replacements applied to the tile of the event. This allow to remove or replace certains words in the title.<br>
				<br><b>Example:</b> <br>
				<code>
					titleReplace: {'Birthday of ' : '', 'foo':'bar'}
				</code>
				<br><b>Default value:</b>
				<code>
				{
					"De verjaardag van ": "",
					"'s birthday": ""
				}
				</code>
			</td>
		</tr>
		<tr>
			<td><code>displayRepeatingCountTitle</code></td>
			<td>Show count title for yearly repeating events (e.g. "X. Birthday", "X. Anniversary")<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
			<td><code>dateFormat</code></td>
			<td>Format to use for the date of events (when using absolute dates)<br>
				<br><b>Possible values:</b> See <a href="http://momentjs.com/docs/#/parsing/string-format/">Moment.js formats</a>
				<br><b>Default value:</b> <code>MMM Do</code> (e.g. Jan 18th)
			</td>
		</tr>
		<tr>
			<td><code>timeFormat</code></td>
			<td>Display event times as absolute dates, or relative time<br>
				<br><b>Possible values:</b> <code>absolute</code> or <code>relative</code>
				<br><b>Default value:</b> <code>relative</code>
			</td>
		</tr>
		<tr>
			<td><code>getRelative</code></td>
			<td>How much time (in hours) should be left until calendar events start getting relative?<br>
				<br><b>Possible values:</b> <code>0</code> (events stay absolute) - <code>48</code> (48 hours before the event starts)
				<br><b>Default value:</b> <code>6</code>
			</td>
		</tr>
		<tr>
			<td><code>urgency</code></td>
			<td>When using a timeFormat of <code>absolute</code>, the <code>urgency</code> setting allows you to display events within a specific time frame as <code>relative</code>
			    This allows events within a certain time frame to be displayed as relative (in xx days) while others are displayed as absolute dates<br>
				<br><b>Possible values:</b> a positive integer representing the number of days for which you want a relative date, for example <code>7</code> (for 7 days)<br>
				<br><b>Default value:</b> <code>7</code>
			</td>
		</tr>
		<tr>
			<td><code>broadcastEvents</code></td>
			<td>If this property is set to true, the calendar will broadcast all the events to all other modules with the notification message: <code>CALENDAR_EVENTS</code>. The event objects are stored in an array and contain the following fields: <code>title</code>, <code>startDate</code>, <code>endDate</code>, <code>fullDayEvent</code>, <code>location</code> and <code>geo</code>.<br>
				<br><b>Possible values:</b> <code>true</code>, <code>false</code>  <br>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>hidePrivate</code></td>
			<td>Hides private calendar events.<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
	</tbody>
</table>

### Calendar configuration

The `calendars` property contains an array of the configured calendars.

#### Default value:
````javascript
config: {
	calendars: [
		{
			url: 'http://www.calendarlabs.com/templates/ical/US-Holidays.ics',
			symbol: 'calendar',
		},
	],
}
````


#### Calendar configuration options:
<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>url</code></td>
			<td>The url of the calendar .ical. This property is required.<br>
				<br><b>Possible values:</b> Any public accessble .ical calendar.
			</td>
		</tr>
		<tr>
			<td><code>symbol</code></td>
			<td>The symbol to show in front of an event. This property is optional.<br>
				<br><b>Possible values:</b> See <a href="http://fontawesome.io/icons/" target="_blank">Font Awesome</a> website.
			</td>
		</tr>
		<tr>
			<td><code>repeatingCountTitle</code></td>
			<td>The count title for yearly repating events in this calendar. <br>
				<br><b>Example:</b> <br>
				<code>'Birthday'</code>
			</td>
		</tr>
		<tr>
			<td><code>user</code></td>
			<td>The username for HTTP Basic authentication.</td>
		</tr>
		<tr>
			<td><code>pass</code></td>
			<td>The password for HTTP Basic authentication.</td>
		</tr>
		</tbody>
</table>
