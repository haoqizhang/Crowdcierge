///////////////////////////////////////////
// TRAVEL TIME CODE
///////////////////////////////////////////

// Do NOT change this reference
var travelTimeEventSource = [];

// Draw travel times after new route calculation
function drawTravelTimes(legTimes) {
	return;
	travelTimeEventSource.length = 0;
	var roundedTimes = []
	for (var i = 0; i < legTimes.length; i++) {
		roundedTimes.push(Math.round(legTimes[i] / 60));
	}
	
	for (var i = 0; i < roundedTimes.length; i++) {
		if (roundedTimes[i]%15 < 7) {
			roundedTimes[i] = Math.floor(roundedTimes[i] / 15) * 15;
		} else {
			roundedTimes[i] = Math.ceil(roundedTimes[i] / 15) * 15;
		}
	}
	
	for (var i = 0; i < itinerary.length; i++) {
		if (roundedTimes[i] == 0) {
			continue;
		}
		var event = {};
		var item = getItem(itinerary[i]);
		event.title = "Travel Time";
		
		event.end = new Date(y, m, d, Math.floor(item.data.start/60) - shift, item.data.start%60);
		event.start = new Date(y, m, d, Math.floor((item.data.start-roundedTimes[i])/60) - shift, (item.data.start-roundedTimes[i])%60);
		
		event.itId = itinerary[i];
		event.isTravel = true;
		event.editable = false;
		
		if (item.data.start >= calBegin) {
			event.color = "rgb(3, 209, 92)";
		} else {
			event.color = "grey";
		}
		
		travelTimeEventSource.push(event);
	}
	
	console.log(travelTimeEventSource);
	
    $("#calendar").fullCalendar('refetchEvents');
	
	console.log(travelTimeEventSource);
	
	shiftEventTimes();
	colorHeaders();
	updateCalendarPins();
	
	detectOverlap();
}

// Removes the travel times from the calendar
function clearTravelTimes() {
	travelTimeEventSource.length = 0;
	$("#calendar").fullCalendar('refetchEvents');
}