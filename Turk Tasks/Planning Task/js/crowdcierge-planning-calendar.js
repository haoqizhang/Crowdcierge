///////////////////////////////////////////
// CALENDAR CODE
///////////////////////////////////////////

// Set time shift
var shift;

// Maintain total duration for scheduling checks
var totalDuration;

// Get today's date
var date = new Date();
var d = date.getDate();
var m = date.getMonth();
var y = date.getFullYear();

var d2;
var m2;
var y2;

// Time used for drop checks. Should be begin time unless mid-trip
var calBegin;
var calEnd;

// Event data. Do NOT change reference
var eventSource = [];

// Local check item list
var checkItems = {};

var slotMinutes = 15;

var refresh =self.setInterval(function(){refreshCalendar()},100);

// Called from document ready to initialize the calendar
// TODO get the actual date of the trip here
function initializeCalendar() {
// Calculate time shifting
var shift; 
if (endTime > 1440) {
    shift = (endTime-1440)/60;
} else {
    shift = 0;
}

beginTime = beginTime - slotMinutes;
//endTime = endTime + slotMinutes;

// Find start and end times pre-shift
var start = beginTime/60 - shift;
var end = endTime/60 - shift;

if (state.admin.date) {
	var tripDate = state.admin.date;
	y2 = Math.round(tripDate/10000);
	m2 = Math.round((tripDate % 10000) / 100) - 1;
	d2 = tripDate % 100;
}

// Initialize calendar with correct times
initCalendar(shift, start, end);

// Add check items stored in state
//checkItems = state.checkItems;
if (!checkItems || checkItems.length == 0) {
    //checkItems = {};
}

for (var key in checkItems) {
    //createCheckItem("#checkStreamBody", checkItems[key]);
}
}

// Initialize the calendar
function initCalendar(timeShift, start, end) {
// Make calendar with specified options
shift = timeShift;
var cal = $("#calendar");
cal.fullCalendar({
    height: 1000000,
    editable: true,
    allDayDefault:false,
    events: [],
    minTime: start,
    maxTime: end,
    allDaySlot: false,
    slotMinutes: slotMinutes,
    eventDrop: syncEventDrop,
    eventResize: syncEventDrag,
    eventClick: function(calEvent, jsEvent, view) {
        eventClick(calEvent, jsEvent, view);
    },
	eventColor: "white",
	eventBorderColor: "gray",
	eventTextColor: "#000000"
});

// Add event sources
cal.fullCalendar( 'addEventSource', eventSource);
cal.fullCalendar( 'addEventSource', travelTimeEventSource);

// Set to day view and remove header
cal.fullCalendar( 'changeView', 'agendaDay');
$(".fc-header").hide();

if (state.admin.date) {
	var tdate = new Date(y2, m2, d2);
	$(".fc-widget-header.fc-col0").text(tdate.toString().split(y2)[0].trim());
}

// Shift table times
var slotNum = (endTime - beginTime)/slotMinutes;
for (var s = 0; s < slotNum; s+=1) {
    var oldTimes = $(".fc-slot" + s).html();
    var newTimes = oldTimes;
    if (newTimes) {
        for (var i = 1; i < 13; i++) {
            var up = i+shift;
            up = up%12;
            if  (i > up && i != 12) {
                if (up == 0) {
                    up = 12;
                }
                newTimes = newTimes.replace(">" + i + "pm", ">" + up + "AM");
                newTimes = newTimes.replace(">" + i + "am", ">" + up + "PM");
            } else {
                if (up == 0) {
                    up = 12;
                }
                newTimes = newTimes.replace(">" + i + "pm", ">" + up + "PM");
                newTimes = newTimes.replace(">" + i + "am", ">" + up + "AM");
            }
        }        
        newTimes = newTimes.replace("AM", "am");
        newTimes = newTimes.replace("PM", "pm");                      
        $(".fc-slot" + s).html(newTimes);
    }
}

// Set table colors
for (var i = 0; i < slotNum; i++) {
    $(".fc-slot"+i+" .fc-widget-content").css("background-color", "#d3f1f2");
}

// Set start and end banners
$(".fc-slot0 .fc-widget-content").css("background-color", "green");
$(".fc-slot0").css("background-color", "green");
$(".fc-slot0 .fc-widget-content").css("text-align", "center");
$(".fc-slot0 .fc-widget-content div").text("Start");

//$(".fc-slot"+(slotNum-1)+" .fc-widget-content").css("background-color", "red");
//$(".fc-slot"+(slotNum-1)+" .fc-widget-content").css("text-align", "center");
//$(".fc-slot"+(slotNum-1)+" .fc-widget-content div").text("End");

// Make event times fix all the time!
//cal.mousemove(function() {
//    refreshCalendar()
//});

// Add items from the itinerary array
fetchEvents();

// Fix event times
shiftEventTimes();

if (inProgress) {
    setCalendarInProgress();
}
colorHeaders();
updateCalendarPins();
}

function refreshCalendar() {
shiftEventTimes();
colorHeaders();
updateCalendarPins();
}

// Modify calendar to show trip progress
function setCalendarInProgress() {
var slotNum = Math.round((interTime - beginTime - slotMinutes)/slotMinutes);
for (var i = 0; i < slotNum; i++) {
    $(".fc-slot"+i+" .fc-widget-content").css("background-color", "#BBBBBB");
}

var oldSlot = $(".fc-slot"+slotNum+" .fc-widget-content div");
oldSlot.css("background-color", "white");
oldSlot.css("position", "absolute");

var newSlot = oldSlot.clone();
newSlot.css("z-index", 1000);
newSlot.css("position", "absolute");
newSlot.css("text-align", "center");
newSlot.css("background-color", "rgba(255, 165, 0, 0.6)");
newSlot.css("width", "85%");
newSlot.text("Current Time:  " + minToTime(calBegin));
newSlot.appendTo(".fc-slot"+slotNum+" .fc-widget-content");

//$(".fc-slot"+slotNum+" .fc-widget-content").css("background-color", "rgba(255, 165, 0, 0.6)");
//$(".fc-slot"+slotNum+" .fc-widget-content").css("z-index", 1000);
//$(".fc-slot"+slotNum+" .fc-widget-content").css("position", "relative");
//$(".fc-slot"+slotNum+" .fc-widget-content").css("text-align", "center");
//$(".fc-slot"+slotNum+" .fc-widget-content").text("Current Time");
}

// Load events on start
function fetchEvents() {
for (var i = 0; i < itinerary.length; i++) {
    addNewItemFromId(itinerary[i]);
}

// Check for overlap
detectOverlap();
}

// Adds a new item to the calendar based on itinerary id
function addNewItemFromId(itineraryId, addNew) {
var event = {};
var item = getItem(itineraryId);
var saveNew = addNew;

// Get event start and end times
event.title = item.data.name;
if (!item.data.start) {
    event.start = new Date(y, m, d, calBegin/60 - shift, 0);
    item.data.start = event.start.getHours()*60 + event.start.getMinutes() + shift*60;
	saveNew = true;
} else {
    event.start = new Date(y, m, d, Math.floor(item.data.start/60) - shift, item.data.start%60);
}
var endTime = item.data.start + parseInt(item.data.duration);
var hours = Math.floor(endTime/60);
event.end = new Date(y, m, d, hours - shift, endTime % 60);

// Change color of traveler decided to keep this activity
if (keepAct && include(keepAct, itineraryId)) {
    event.backgroundColor="grey";
}

if (item.data.start < interTime) {
    event.backgroundColor="grey";
    finishedAct.push(itineraryId);
}

// Push event out and do usual calendar cleanup
event.itId = itineraryId;
eventSource.push(event);
$("#calendar").fullCalendar('refetchEvents');
detectOverlap();
shiftEventTimes();

if (saveNew) {
    saveItemEdit(item);
}
}

function updateItineraryOnCalendar() {
// Sort event source list based on client events
eventSource.length = 0;
var newEvents = $("#calendar").fullCalendar( 'clientEvents' );
for (var i  = 0; i < newEvents.length; i++) {
    eventSource.push(newEvents[i]);
}
eventSource.sort(function(a,b) {
    return (a.start.getHours() + a.start.getMinutes()/60) - (b.start.getHours() + b.start.getMinutes()/60);
});

// Update itinerary order and save route if necessary
var newItinerary = [];
for (var i = 0; i < eventSource.length; i++) {
    newItinerary.push(eventSource[i].itId);
}

// Save new itinerary order
itinerary = newItinerary;
saveItinerary();
refreshCalendar();
}

// Removes an item from the calendar based on itinerary id
function removeItemFromId(itineraryId) {
for (var i = 0; i < eventSource.length; i++) {
    if (eventSource[i].itId == itineraryId) {
        eventSource.splice(i, 1);
    }
}
$("#calendar").fullCalendar('refetchEvents');
}

// Update the calendar based on an edit made in a dialog
function updateEditCalendar(oldId, newId) {
removeItemFromId(oldId);
addNewItemFromId(newId);
}

// Update the event source with the events in the calendar and updates route order
// Called on event drops
function syncEventDrop(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
if(!enableEditting){
	revertFunc();
	alert("You must accept the HIT before you can save any edits.");
	return;
}

// Prevent dragging past start time
var si = getItem(event.itId);
var newStart = si.data.start + minuteDelta;
var newEnd = newStart + parseInt(si.data.duration);
if (keepAct && finishedAct && (newStart < calBegin || include(keepAct, event.itId) || include(finishedAct, event.itId) || newEnd > calEnd)) {
    revertFunc();
    return;
}
clearTravelTimes();

// Sort event source list based on client events
eventSource.length = 0;
var newEvents = $("#calendar").fullCalendar( 'clientEvents' );
for (var i  = 0; i < newEvents.length; i++) {
    eventSource.push(newEvents[i]);
}
eventSource.sort(function(a,b) {
    return (a.start.getHours() + a.start.getMinutes()/60) - (b.start.getHours() + b.start.getMinutes()/60);
});

// Update itinerary order and save route if necessary
var newItinerary = [];
for (var i = 0; i < eventSource.length; i++) {
    newItinerary.push(eventSource[i].itId);
}

// Save new itinerary order
itinerary = newItinerary;
saveItinerary();

// Save start of activity
si.data.start = newStart;
saveItemEdit(si);
detectOverlap();
shiftEventTimes();
}

// Update activity durations
// Called on even drag
function syncEventDrag(event, dayDelta, minuteDelta, revertFunc) {
if(!enableEditting){
	revertFunc();
	alert("You must accept the HIT before you can save any edits.");
	return;
}

var si = getItem(event.itId);
var newEnd = si.data.start + parseInt(si.data.duration) + minuteDelta;
if (include(keepAct, event.itId) || include(finishedAct, event.itId) || newEnd > calEnd) {
    revertFunc();
    return;
}
clearTravelTimes();

eventSource.length = 0;
var newEvents = $("#calendar").fullCalendar( 'clientEvents' );
for (var i  = 0; i < newEvents.length; i++) {
    eventSource.push(newEvents[i]);
}
eventSource.sort(function(a,b) {
    return (a.start.getHours() + a.start.getMinutes()/60) - (b.start.getHours() + b.start.getMinutes()/60);
});

var si = getItem(event.itId);
si.data.duration = parseInt(si.data.duration) + minuteDelta + "";
saveItemEdit(si);
detectOverlap();
shiftEventTimes();
}

// Check if there is any overlap in our current event set
function detectOverlap() {
// Reload timeblocks for overlap check
var timeBlocks = [];
totalDuration = 0;
for (var i = 0; i < eventSource.length; i++) {
    var event = eventSource[i]
    var block = {};
    block.start = event.start.getHours() + event.start.getMinutes()/60;
    block.end = event.end.getHours() + event.end.getMinutes()/60;
    totalDuration += block.end - block.start;
    timeBlocks.push(block);
}

for (var i = 0; i < travelTimeEventSource.length; i++) {	
    var event = travelTimeEventSource[i]
    var block = {};
    block.start = event.start.getHours() + event.start.getMinutes()/60;
    block.end = event.end.getHours() + event.end.getMinutes()/60;
    totalDuration += block.end - block.start;
    timeBlocks.push(block);
}

var problem = "Two of the items in the itinerary are overlapping.  Move them around so that no activities cover each other, or remove activities to free up time.";
var n = new note("Itinerary items are overlapping",
problem, ['todo', 'time']);
var si = new streamitem('todo', n, null);
si.id = 'sys_overlap_items';

var add = false;
for (var j in timeBlocks) {
    var check = timeBlocks[j];
    for (var k in timeBlocks) {
        var other = timeBlocks[k];
		if (check.end*60 < calBegin || other.end*60 < calBegin) {
			continue;
		}
        if ((check.start < other.end && check.start > other.start) || (check.end > other.start && check.end < other.end)) {
            add = true;
        }
    }
}

if (add && $("#stream_sys_overlap_items").length == 0) {
    sysStream.push(si);
    
    if (inProgress) {
        displayStreamItem("#replanStreamBody", si);
    } else {
        displayStreamItem("#sysStreamBody", si);
    }
}
}

// Shifts event times by specified value
function shiftEventTimes() {
var times = $(".fc-event-time");
for (var t = 0; t < times.size(); t++) {
    var oldTimes = $(times[t]).parent().html();
    var newTimes = oldTimes;
    if (newTimes) {
        for (var i = 1; i < 13; i++) {
            var up = i+shift;
            if (up > 12) {
                up = up - 12;
            }
            newTimes = newTimes.replace(">" + i + ":", "> " + up + ":");
            newTimes = newTimes.replace(">" + i + ":", "> " + up + ":");
            newTimes = newTimes.replace("- " + i + ":", " -  " + up + ":");
            newTimes = newTimes.replace("- " + i + ":", " -  " + up + ":");
            
        }               
        $(times[t]).parent().html(newTimes);
    }
}

$(".fc-event").css("font-size", "1em");
$(".fc-event").css("font-weight", "bold");
}
	
// Updates the pin numbers on the calendar
function updateCalendarPins() {
$(".deleteme").remove();
var eventDivs = $(".fc-event-title");
for (var i = 0; i < itinerary.length; i++) {
	for (var j = 0; j < eventDivs.length; j++) {
		if (getItem(itinerary[i]).value == $(eventDivs[j]).html()) {
			$(eventDivs[j]).parent().prepend("<div class='sspinpos deleteme' style='float:left; margin-right:10px; margin-top:2px'>"+(i+1)+"</div>");
		}
	}
}
}

// Change color of event headers
function colorHeaders() {
//if (!inProgress) {
//	$(".fc-event-head").css("background-color","#CCCCCC");
//} else {
	var eventDivs = $(".fc-event-title");
	for (var i = 0; i < itinerary.length; i++) {
		for (var j = 0; j < eventDivs.length; j++) {
			if ($(eventDivs[j]).html() == "Travel Time" || $($(eventDivs[j]).parent().parent().children()[0]).html().indexOf("Travel Time") != -1) {
				continue;
			}
			if (getItem(itinerary[i]).data.start >= calBegin && getItem(itinerary[i]).value == $(eventDivs[j]).html()) {
				$($(eventDivs[j]).parent().parent().children()[0]).css("background-color", "#CCCCCC");
			}
		}
	}
//}
}

// Save dragged and drop edit
function saveItemEdit(oldsi) {
if(!enableEditting){
	revertFunc();
	alert("You must accept the HIT before you can save any edits.");
	return;
}

var oldid = oldsi.id;
newactpinMoved = false;
var n = new activity(oldsi.data.name, oldsi.data.description, null, oldsi.data.location, null, oldsi.data.duration, oldsi.data.categories);

var si = new streamitem('activity', n, null);
si.data.start = oldsi.data.start;

if (oldsi.edited == undefined) {
    si.edited = [uid];
} else {
    si.edited = oldsi.edited;
    si.edited.push(uid);
}

// submit it
var id = submitEdit(si, oldid);
if (id != null) {
    si.id = 'user_' + id;
} else {
    return;
}

// add it to local stream
userStream.unshift(si);
searchAutocomplete.autocomplete("option", "source", userStream);
newStream.unshift(si);

// 3. what about itinerary?
// 3a... in itinerary list, get rid of old and insert new
var initinerary = false;
var pos = 1;
for (var i = 0; i < itinerary.length; i++) {
    if (itinerary[i] == oldid) {
        pos = i + 1;
        itinerary.splice(i, 1, si.id);
        initinerary = true;
        break;
    }
}

var item = createStreamItem(si);
$('#userStreamBody').prepend(item);

// remove the old one
// 1. remove from stream
$('#stream_' + oldid).remove();
// 2. remove from userStream

for (var i = 0; i < userStream.length; i++) {
    if (userStream[i].id == oldsi.id) {
        userStream.splice(i, 1);
        break;
    }
}

if (initinerary) {
    // HQ: NOTE: WE DO NOT SAVE THE ITINERARY. We just update things so that 
    // if the person were to save then it would save correctly. Instead of saving the 
    // itinerary, we update the change onto the latest state in the system in SubmitEdit

    // save the itinerary before moving on.
    //saveItinerary();

    // 3b... in wayhash, get rid of old and insert new;
    waylayer.DeleteShape(wayhash[oldid].pin);
    delete wayhash[oldid];
    AddWaypointPin(si);


    // 3c... in itinerary display, get rid of old and insert new

    var item = createItineraryItem(si.id, true, pos, si.data.name, si.data.location.name, '' + si.data.duration + ' min + travel', true);
    $(item).insertAfter('#' + oldsi.id);
    $('#' + oldsi.id).remove();
    updateItineraryDisplay();

    updateEditCalendar(oldid, si.id); // for calendar
}
}

// Click handler for events in the calendar
function eventClick(calEvent, jsEvent, view) {
var item = getItem(calEvent.itId);
map.SetCenter(new VELatLong(item.data.location.lat, item.data.location.long));
map.SetCenter(new VELatLong(item.data.location.lat, item.data.location.long));
var index = itinerary.indexOf(calEvent.itId) + 1;
var pins = $(".pinpos");
for (var i = 0; i < pins.length; i++) {
	if ($(pins[i]).text() == index) {
		$(pins[i]).mouseover();
	}
}
}