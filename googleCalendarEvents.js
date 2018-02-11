// Client ID and API key from the Developer Console
var CLIENT_ID = '245937121380-he6hidl1lkhobedfvtpfpcgbdqfl6ced.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCt5vOxIML57zscI-Cv33Tjsm-uq_Tt9Ug';

// Array of API discovery doc URLs for APIs
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize-button');

var monthSelect = dateForm.monthSelect;
var yearSelect = dateForm.yearSelect;

monthSelect.addEventListener('change', workingEventList);
yearSelect.addEventListener('change', workingEventList);

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById('authorize').style.display = 'none';
    /*here we go*/
    workingEventList();
  } else {
    document.getElementById('authorize').style.display = 'block';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendList(message) {
  var list = document.getElementById('list');
  var textContent = document.createTextNode(message + '\n');
  list.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function workingEventList() {
    var listElem = document.getElementById('list');
    listElem.textContent = '';

    var totalElem = document.getElementById('total');
    totalElem.textContent = '';

    var month = monthSelect.options[monthSelect.selectedIndex];
    var year = yearSelect.value;
    
    var startDate = (new Date(year, month.value, 1));
    var endDate = (new Date(year, month.value + 1, 0));

    console.log('startDate: ', startDate);
    console.log('endDate: ', endDate);

  gapi.client.calendar.events.list({
    'calendarId': 'ohq5d4lkt6j2emh4f3dpk73hhk@group.calendar.google.com',
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    var sumHours = 0;
    var n = 0;

    if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
            var event = events[i];
            var date = new Date(event.start.dateTime);
            var dateEnd = new Date(event.end.dateTime);
            
            if(date.getMonth() != startDate.getMonth() || date.getFullYear() != startDate.getFullYear()){
                    continue;
                }
                
            console.log('date: ', date);
            console.log('dateEnd: ', dateEnd);

            var startHours = date.getHours();
            var startMinutes = date.getMinutes() / 60;
            var endHours = dateEnd.getHours();
            var endMinutes = dateEnd.getMinutes() / 60;
            var hours = (endHours + endMinutes) - (startHours + startMinutes);

            n = n + 1; 

            var divElem = document.createElement("div");
            var dateTime = '';
            if (n < 10) {
              dateTime += '0';
            }
            dateTime += n.toString() + '. ' + ' ' + date.toLocaleString() + ' - ' + dateEnd.toLocaleTimeString() + ' -- ' + hours;
            if(hours*10 % 10 == 0){
              dateTime += '.0'
            }
            
            var textElem = document.createTextNode(dateTime);
            divElem.appendChild(textElem);
            // appendList(divElem);    
            document.getElementById('list').appendChild(divElem);

            sumHours += hours;
        }
    }

    if (listElem.textContent == ''){
        appendList('No working events found.');
    } else {
        var textElem = document.createTextNode('Total number of hours in ' + month.text + ': ' + sumHours);
        totalElem.appendChild(textElem);
    }
  });
}