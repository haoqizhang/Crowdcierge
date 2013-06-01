///////////////////////////////////////////
// LOAD INTERMEDIATE STATE CODE
///////////////////////////////////////////

// Boolean to determine if the trip is in progress, either determined by time or set in DB
var inProgress = false;

// Boolean to determine if we should set the calendar start or make finished activities a diff color
var setStart = false;

// Local storage of intermediate state data
var inter;
var interTime;
var interLat;
var interLog;
var finishedAct = [];
var fixRequest;
var keepAct = [];
var currentPin;

var requestCheckItem;


var oldItinerary;

var startTaskTime = (new Date()).getTime();

// Load intermediate state
function loadIntermediateState() {
    // Show the replanning stream, not the full sys stream
    $("#sysStreamBody").hide();
    $("#replanStreamBody").show();

    inter = state.inter
    interTime = inter.time;  // Time of request
    interLat = inter.lat;   // Latitude location
    interLong = inter.long; // Longitude location
    keepAct = inter.keepActivities;    // What activities need to remain on the itinerary (optional)
    fixRequest = inter.request;    // What the request is, containing extra info if needed
    oldItinerary = JSON.stringify(itinerary);
    
    // Set calendar check time to intermediate time
    calBegin = interTime;
    
    // Place user pin at current location and center map on that location
    var locLL = new VELatLong(interLat, interLong);
    currentPin = AddPushpin(map, locLL, "Traveler's Location", "Where the traveler is right now", false, "img/pin-user-2.png");
	$("img[src$='img/pin-user-2.png']").parent().parent().css("z-index", 10000);
    map.SetCenter(locLL);
	
	AddPushpin(newactmap, locLL, "Traveler's Location", "Where the traveler is right now", false, "pin-user-2.png");
	
	$("html").mouseover(function() {
		$("img[src$='img/pin-user-2.png']").parent().parent().css("z-index", 10000);
	});
	$("#mapDiv").mouseup(function() {
		$("img[src$='img/pin-user-2.png']").parent().parent().css("z-index", 10000);
	});
}

// Create the check item related to the request
function processRequest() {
    var problem;
	var title;
    if (fixRequest.data.activity.id) {
		var pinString = "<span><span class='sspinpos' style='display:inline-block'>" + (fixRequest.data.activity.position+1) + "</span><span style='font-style:italic; font-weight:bold'>" + fixRequest.data.activity.name + '</span></span>';
        problem = jQuery.validator.format(requestText[fixRequest.type], pinString, fixRequest.data.activity.position, fixRequest.data.message, categories.join(", "));
		title = jQuery.validator.format(requestTitle[fixRequest.type], pinString, fixRequest.data.activity.position, fixRequest.data.message, categories.join(", "));
    } else {
		title = jQuery.validator.format(requestTitle[fixRequest.type], "", "", fixRequest.data.message);
        problem = jQuery.validator.format(requestText[fixRequest.type], "", "", fixRequest.data.message);
    }
    problem = problem + jQuery.validator.format(keepInMind, categories.join(", ")) + submissionInstructions;
    var checklist = jQuery.validator.format(requestCheck[fixRequest.type], pinString, categories.join(", "));
	
    var n = new note(title, problem, ['check', 'request']);
    var si = new streamitem('check', n, null);
	si.requestType = fixRequest.type;
	si.requestCheck = checklist;
    si.id = 'sys_request_check';
    si.onResolve = function() {
		if (!enableEditting) {
			alert("You need to accept the HIT and fix the problem before you can submit.");
			return;
		}
		
        if ($("#stream_sys_overlap_items").length != 0) {
            alert("Some items in the plan are overlapping.  You can only submit the task when no two events are scheduled during the same time.");
            return;
        }
        
        if (oldItinerary == JSON.stringify(itinerary)) {
            alert("You didn't make any changes to the trip plan, so you can't submit this task yet.  Fix the trip plan and then submit.");
            return;
        }
        
        $("#stream_" + si.id).remove();
        delete checkItems[si.id];
        saveResolution();
        closeAdd();
		
		if (isTask) {
			$("#submitter").click();
		} else {
			alert("Hurray, you finished!  Thanks for helping me debug this.  Please don't change anything else about the plan now.");
		}
    };
    
    requestCheckItem = si;
    createCheckItem("#checkStreamBody", si);
}

// Save that the intermediate problem has been resolved
// Currently just sets inProgress to false
function saveResolution() {
    state.inProgress = false;
	var d = new Date();
	state.inter.taskCompleteTime = d.getTime() - startTaskTime;
    
    var ret = true;

    jQuery.ajax({
        type: "POST",
        url: "http://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/submitTurkTourItinerary.php",
        async: false,
        data: ({
            userId: uid,
            answer: JSON.stringify(state),
            taskId: tid,
            startState: stateId,
            assignmentId: assignmentId,
            type: "turktour"
        }),
        success: function (msg) {
            if (msg == "") {
                // cannot save it
                alert("It appears that someone else has recently made a change that conflicts with the changes you are trying to save. Please refresh the page before continuing. We apologize for the inconvenience");
                ret = false;
                return;
            } else {
                disableItSave();
            }
        }
    });
    return ret;
}