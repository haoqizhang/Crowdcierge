// admin variables
var eventName;
var description;
var categories;
var constraints;
var constraintsFunc = [];
var start;
var end;
var beginTime;
var endTime;

// map variables
var map = null;
var newactmap = null;
var startPin = null;
var endPin = null;
var newactPin = null;
var viewactPin = null;
var findLayer = null;
var slRoute = null;
var actfindLayer = null;
var mapCenter = null;
var numTags = 0;
var waylayer = null;
var wayhash = [];
var waypointIcon = '../img/wp.gif'; // ../img/pin2.gif
var defaultZoom = 12;
var newactpinMoved = false;
var remainingRoute = [];
var longLegs = [];
var restDrive = null;
var restWalk = null;
var tolerance = 0.00005;

// itinerary/stream variables
var emptyText = "search or add an idea, or click on one below"; // "search or add an activity or thought";
var userStream = []; //user comments, whichever type
var sysStream = []; //system todo

// save variables
var unsavedChanges = false;
var sessionStart = null;

// auto complete
var searchAutocomplete = null;
var locationAutocomplete = null;
var editlocationAutocomplete = null;
var donearby = true;
var ontopname = null;

// activity variables
var activityDurations = [1, 5, 10, 15, 20, 30, 45, 60, 75, 90, 105, 120, 180, 240, 300, 360, 420, 480]; // in minutes
var campuslocations = [];
var lastSearch = null;
var lasteditSearch = null;

// task variables
// Test task variables.
var tid = "72f2a275c14c3af09e6c2f2b73f03241";
//var uid = "57187fd22e931d8b2145d920967e559d";
//var tid = null;
var uid = null;
var calculatedEnd = null;
var user = null;
var numusers = null;
var creatorName = null;
var assignmentId = null;
var transit = null;
var enableEditting = false;
var isTask = false;

// What actually happens at start
$(document).ready(function (jQuery) {
    sessionStart = (new Date()).getTime();

    readyBoxClose();

    readUrlParameters(); // get userId and taskId
    jQuery('#mobi-content').css('display', 'inline');

    loadTaskState(); // Load where we are current at with task
    
    loadUserData();
    initMap();

    loadStream(); // load all the stream info
    loadStateIntoInterface(); // now load it all into interface.

    unsavedChanges = false;

    GetNewActMap();
    readySearchBox();

    $(window).resize(function () {
        /// HACK TO FIX MAP RESIZE PROBLEMS
        if (map != null) {
            map.Resize();
        }
        delay(function () {
            if (map != null) {
                map.SetCenter(map.GetCenter());
            }
        }, 1000);
    });

    /// HACK TO FIX IE SCROLL PROBLEM
    if ($.browser.msie) {
        /// nevermind, just tell the person they should use something else
        alert("We have noticed that you are using Internet Explorer as your browser. Some of the functionalities of this site may not work well in Internet Explorer, so we recommend you to use any other popular browser, e.g., Firefox, Safari, or Chrome. Sorry for the inconvenience.");
        // make stream not scroll
        $('#brainstream').css('overflow', 'hidden');
        // make left1 (stream containing section) scrool
        $('#left1').css('overflow', 'auto');
    }

    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        var re = new RegExp("^" + this.term);
        var t = item.label.replace(re, "<span style='font-weight:bold;color:Blue;'>" + this.term +
            "</span>");
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a>" + item.value + "</a>")
            .appendTo(ul);
    };
    
    calBegin = beginTime;
	calEnd = endTime;
    inProgress = state.inProgress;
    if (inProgress) {
        loadIntermediateState();
    }

    initializeCalendar();
	
    if (inProgress) {
        processRequest();
		if (isTask) {
			configureReplanTaskUi();
		}
    }
	
    showExplanationBox();
	
	$('#searchBox').bind('keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			addSelect();
		}
	});
});

// Show either the mission or the check item for the replanning task
function showExplanationBox() {
    if (inProgress) {
        viewCheck(requestCheckItem);
        $("#gotit").show();
        $(".resolveSelect").hide();
        $("#gotit").click(function() {
            closeAdd();
        });
    } else {
        viewMission();
    }
}

// Called first in document ready to set up popup box
function readyBoxClose() {
    $('#boxclose').click(function () {
        closeAdd();
    });
}

// Hides popup box and everything inside
function closeAdd() {
    newactpinMoved = false;
    $('#searchBox').val(emptyText);
    $('#searchBox').css('color', 'gray');
    $('#box').css('top', '-700px');
    $('#overlay').hide();
    $('#viewMission').hide();
    $('#editMission').hide();
    $('#viewHelp').hide()
    $('#signup').hide()
    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#signup').hide();
    $('#viewActivity').hide();
    $('#viewSelect').hide();
    $('#editActivity').hide();
    $('#editNote').hide();
    $('#editEnd').hide();
    $('#editStart').hide();
    $("#viewCheck").hide();
	
	// Update the calendar display
	shiftEventTimes();
	colorHeaders();
	updateCalendarPins();
}

function showBox() {
    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });
}

function readUrlParameters() {
    var params = getURLParams();
	
	if (params.assignmentId) {
		isTask = true;
		configureCrowdTaskUi();
		
		if (params.assignmentId) {
			if (params.assignmentId == "ASSIGNMENT_ID_NOT_AVAILABLE") {
				$('input[type=submit]').attr("disabled", "true")
				$('#submitter').val("Please read HIT instructions above. You have yet to accept the HIT, but can try out the tool!");
			} else {
				   isOnGoing = true;					  
				if ($('*[name]').length < 2) {
					$('#submitter').attr('name', 'submit')
				  
				}
				if ($('*[name]').length < 2) {
					$('#assignmentId').after('<input type="hidden" name="default" value="default"></input>')
				}
			}
			$('#assignmentId').attr('value', params.assignmentId)
			$('form').attr('method', 'POST')

		}
		
		if (params.turkSubmitTo) {
			$('form').attr('action', params.turkSubmitTo + '/mturk/externalSubmit')
		}

		updateSubmit();

		if(params.tid){
			tid = params.tid;
		}

		if(params.workerId){
			uid = params.workerId;
		}

		if(params.assignmentId){
			assignmentId = params.assignmentId;
		}
		
	} else {
		enableEditting = true;
		
		if (params.tid) {
			tid = params.tid;
		}

		if (params.uid) {
			uid = params.uid;
		}
	}
    return;
}

// Ready the UI for a crowd task instead of an admin
function configureCrowdTaskUi() {
	$("#helpButton").text("HIT instructions");
	$("#footer").html('<form id="subForm" action="." method="GET"><input type="hidden" name="assignmentId" id="assignmentId" value="temp"></input><input style="background:#ffab07;color:white;border: black 1px solid; font-size:20px;" id="submitter" type="submit" value="Submit"></input></form><button style="background:#ffab07;color:white;border: black 1px solid; font-size:20px;" id="viewReplanTask">Submit</button>');
	$("#editmissionbutton").hide();
	$("#viewReplanTask").hide();
	$("#viewHelp").html("<h1 id='helpheader'>How to help</h1>     <div id='helpinstructions'>       You and other Turkers are helping to plan a trip together via many micro-contributions! <b>Please read the mission details</b>. You can submit the HIT as soon as you        make ANY CONTRIBUTION by doing any of the following:       <ul> 	<li><b>Review todo items at the top of the brainstream</b> 	  These notes tell you what needs work. Pay attention to them as you help out.</li> 	<li><b>Add an idea to the brainstream</b><br/>Add your ideas for specific activities, or general thoughts about the plan, to the brainstream.</li> 	<li><b>Add an activity to the itinerary</b><br/>See a good suggestion from someone else in the brainstream? Click it and add it to the itinerary.</li> 	<li><b>Improve the itinerary</b><br/>Review the current itinerary on the map or in list view. See a way to save time or improve the trip? You can drag activities in the itinerary list to rearrange their order.</li> 	<li><b>Edit or remove an activity from the itinerary</b><br/>See an item in the itinerary that can be replaced with something better, or takes up too much time? Click it to edit or remove it.</li> 	  <li><b>Revise an idea in the brainstream</b><br/>Have some fun details to fill in, see an incorrectly marked location, or notice a typo? Edit the idea to improve it.</li>       </ul>       Note: you just have to make a small contribution in one or more of the above ways to get paid! We hope you have fun with the HIT, and please do provide us feedback on TurkerNation. Thanks!     </div>");
}

// Update the task UI for replanning instead of planning
function configureReplanTaskUi() {
	$("#submitter").hide();
	$("#viewReplanTask").show();
	$("#viewReplanTask").click(function() {
		$("#stream_sys_request_check").click();
		$("#gotit").hide();
		$('#viewchecklist').show();
		$('#viewcheckdesc').hide();
	});
	$("#helpButton").removeAttr("onclick");
	$("#helpButton").click(function() {
		$(".resolveSelect").hide();
		$("#gotit").show();
		$("#gotit").click(function() {
			$(".resolveSelect").show();
			closeAdd();
			$("#gotit").hide();
		});
		$("#stream_sys_request_check").click();
	});
	$('#submitter').val("Submit");
	$('input[type=submit]').removeAttr("disabled");
}

// Sync ajax call. Loads the task state into the code based on task id
// Loads requester data as well
function loadTaskState() {
    jQuery.ajax({
        type: "GET",
        // dataType: "json", 
        url: "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/loadTurkTourTaskState.php",
        data: ({
            type: "turktour",
            id: tid
        }),
        async: false,
        success: function (obj) {
            if (obj == "") {} else {
                state = eval('(' + obj + ')');
                stateId = state.stateId;
                state = eval('(' + state.state + ')');

                loadHostData(state.admin); // requester's stuff
            }
        }
    });
    return;
}

// Load user data. Writes in mission title, description, etc.
// Loads constraints
function loadHostData(data) {
    eventName = data.name;
    description = data.description;
    categories = data.categories;
    constraints = data.constraints;
    start = data.start;
    end = data.end;
    beginTime = data.beginTime;
    endTime = data.endTime;
    var creator = data.creator;
    creatorName = data.creator;

    transit = true;

    $("#eventName").html(data.name.replace(/\n/g, "<br/>"));
    $("#description").html(data.description.replace(/\n+$/, '').replace(/\n/g, "<br/>"));
    $('#missiontitle').html($('#eventName').text());
    $('#missiondesc').html($('#description').text());
    displayConstraints();

    if (creator == "itonly") {
        $('#addcontrols').html("<button class='addit' onClick='saveAddActivity(false)'>add it to stream & itinerary</button>");
    }

    // process constraints
    constraintsFunc = [];
    for (var i = 0; i < constraints.length; i++) {
        constraintsFunc.push(generatePredicate(constraints[i]));
    }
}

function readySearchBox() {
    $('#searchBox').blur(function () {
        if ($(this).val() == '') {
            $(this).val(emptyText);
            $(this).css('color', 'gray');
        }
    });

    $('#searchBox').focus(function () {
        if ($(this).val() == emptyText) {
            $(this).val('');
            $(this).css('color', 'black');
        }
    });

    searchAutocomplete = $('#searchBox').autocomplete({
        minLength: 2,
        source: userStream,
        select: function (event, ui) {
            var item = ui.item;
            $('#searchBox').val(item.value);
            openItem(item);
            return false;
        }
    });

    return;
}

function GetNewActMap() {
    newactmap = new VEMap('addmapDivMap');

    var mapOptions = new VEMapOptions();
    mapOptions.DashboardColor = 'black';
    newactmap.SetDashboardSize(VEDashboardSize.Tiny);
    newactmap.HideScalebar();

    mapOptions.UseEnhancedRoadStyle = true;
    newactmap.LoadMap(mapCenter, 10, 'r', false, VEMapMode.Mode2D, true, 0, mapOptions);
    newactmap.SetZoomLevel(defaultZoom);

    // Layer for find
    actfindLayer = new VEShapeLayer();
    actfindLayer.SetTitle("findLayer");
    newactmap.AddShapeLayer(actfindLayer);

    newactPin = AddPushpin(newactmap, null, 'new activity', '', true, "../img/pin-end.png");
    newactPin.SetZIndex(2000);
    newactPin.onenddrag = OnTop('#addactloc');

    viewactPin = AddPushpin(newactmap, null, '', '', false, "../img/pin2.gif");
    viewactPin.Hide();
}

function OnTop(name) {
    ontopname = name;
    return function RightOnTop(e) {
        // check overlap with objects from search nearby
        newactpinMoved = true;
        var shape;
        var numResults = actfindLayer.GetShapeCount();
        var overlap = false;
        for (var i = 0; i < numResults; i++) {
            shape = actfindLayer.GetShapeByIndex(i);
            var lngdiff = Math.abs(shape.GetPoints()[0].Latitude - e.LatLong.Latitude);
            var latdiff = Math.abs(shape.GetPoints()[0].Longitude - e.LatLong.Longitude);

            // TODO: compute based on level of zoom!!!!!
            if (lngdiff < 0.0004 && latdiff < 0.0004) {
                // populate title
                e.Shape.SetTitle(shape.GetTitle());
                e.Shape.SetPoints(shape.GetPoints());
                e.Shape.SetCustomIcon('../../img/pin-start.png');
                newactmap.SetCenter(shape.GetPoints()[0]);
                $(name).val(shape.GetTitle());
            }
        }
    }
}

function GetRoute(locations) {
    slRoute.DeleteAllShapes();
    var credentials = "AmoK7LJck9Ce_JO_n_NAiDlRv88YZROwdvPzWdLi57iP3XQeGon28HJVdnHsUSkp";
    restDrive = [];
    restWalk = [];
    indexArr = [];
    for (var i = 0; i < locations.length - 1; i++) {
        restDrive.push(null);
        restWalk.push(null);
        indexArr.push(i);
    }

    $(indexArr).each(function () {
        var i = this;
        var str = "wayPoint.1" + "=" + locations[i].Latitude + "," + locations[i].Longitude + "&";
        str += "wayPoint.2" + "=" + locations[i + 1].Latitude + "," + locations[i + 1].Longitude;

        var driveStr;
        // do a i to i + 1 route
        if (transit) {
            driveStr = "https://dev.virtualearth.net/REST/v1/Routes/Transit?timeType=Departure&dateTime=3:00:00PM&" + str + "&routePathOutput=Points&output=json&distanceUnit=mi&key=" + credentials + "&jsonp=?";
        } else {
            // do driving path
            driveStr = "https://dev.virtualearth.net/REST/v1/Routes/Driving?" + str + "&routePathOutput=Points&output=json&distanceUnit=mi&key=" + credentials + "&jsonp=?";
        }
        var walkStr = "https://dev.virtualearth.net/REST/v1/Routes/Walking?" + str + "&routePathOutput=Points&output=json&distanceUnit=mi&key=" + credentials + "&jsonp=?";

        $.getJSON(driveStr, GenerateCB(i, 'drive'));
        $.getJSON(walkStr, GenerateCB(i, 'walking'));
    });
}

function GenerateCB(z, type) {
    return function MyCallBack(result) {
        var val = result;
        if (result && result.resourceSets && result.resourceSets.length > 0 && result.resourceSets[0].resources && result.resourceSets[0].resources.length > 0) {} else {
            val = false;
        }

        if (type == 'drive') {
            restDrive[z] = result;
        } else {
            restWalk[z] = result;
        }

        if (gotAllPieces()) {
            composeRoute();
        }
    };

}

function gotAllPieces() {
    return (restDrive.length == restDrive.filter(function (x) {
        return x != null;
    }).length && restWalk.length == restWalk.filter(function (x) {
        return x != null;
    }).length);
}

// Times stored here
function composeRoute() {
    // got all pieces
    var legTimes = [];
    var mode = [];

    // 1. Figure out the composition before doing anything else
    for (var i = 0; i < restDrive.length; i++) {
        var driveTime = null;
        var walkTime = null;
        if (restDrive[i] && restDrive[i].resourceSets[0]) {
            driveTime = restDrive[i].resourceSets[0].resources[0].routeLegs[0].travelDuration;
        }
        if (restWalk[i] && restWalk[i].resourceSets[0]) {
            walkTime = restWalk[i].resourceSets[0].resources[0].routeLegs[0].travelDuration;
        }

        var routeline;

        var walkOnly = false;
        var driveOnly = false;
        if (driveTime == null) {
            walkOnly = true;
        }
        if (walkTime == null) {
            driveOnly = true;
        }

        if (!driveOnly && (walkOnly || driveTime > walkTime || walkTime < 15 * 60)) {
            mode.push('walk');
            legTimes.push(walkTime);
            routeline = restWalk[i].resourceSets[0].resources[0].routePath.line;
        } else {
            mode.push('drive');
            legTimes.push(driveTime);
            routeline = restDrive[i].resourceSets[0].resources[0].routePath.line;
        }

        var routepoints = new Array();
        for (var j = 0; j < routeline.coordinates.length; j++) {
            routepoints[j] = new VELatLong(routeline.coordinates[j][0], routeline.coordinates[j][1]);
        }

        // Draw the route on the map
        var shape = new VEShape(VEShapeType.Polyline, routepoints);

        shape.SetLineColor(new VEColor(3, 209, 92, 1));
        shape.SetLineWidth(3);

        shape.HideIcon();
        shape.SetTitle("MyRoute");
        shape.SetZIndex(1000, 2000);
        slRoute.AddShape(shape);
    }

    var time = beginTime;
    var i = 0;

    $('.ittime').each(function () {
        time += Math.round(legTimes[i] / 60);
        var next = time + wayhash[itinerary[i]].duration;
        $(this).html('(' + minToTime(time) + '-' + minToTime(next) + ')');
        time = next;
        i++;
    });

    // set end time
    var actualend = time + Math.round(legTimes[i] / 60);
    updateScheduleConstraints(actualend);

    if (actualend > endTime + 10) {
        $('.endtime').last().html("<font color='red'>(" + minToTime(actualend) + ')</font>');
    } else {
        $('.endtime').last().html('(' + minToTime(actualend) + ')');

    }
    $('#totaltriptime').html(readMinutes(actualend - beginTime));

	// Add travel times to calendar
	drawTravelTimes(legTimes);
	
    restDrive = null;
    restWalk = null;
}

function GetLongRoute(locations) {
    var options = new VERouteOptions;

    // Get WALKING directions
    options.RouteMode = VERouteMode.Walking;

    // We will draw route ourselves
    options.DrawRoute = false;

    // So the map doesn't change:
    options.SetBestMapView = false;

    // Call this function when map route is determined:
    options.RouteCallback = ProcessPartialRoute;

    // Show as miles
    options.DistanceUnit = VERouteDistanceUnit.Mile;

    // Show the disambiguation dialog
    options.ShowDisambiguation = false;

    remainingRoute = locations;

    var locs = [];
    var breaksize = 25;
    for (var j = 0; j < locations.length && j < breaksize; j++) {
        locs.push(locations[j]);
    }

    remainingRoute.splice(0, breaksize - 1);
    // got my segment
    map.GetDirections(locs, options);
}

function ProcessPartialRoute(route) {
    var shape = new VEShape(VEShapeType.Polyline, route.ShapePoints);
    shape.SetLineColor(new VEColor(3, 209, 92, 1));
    shape.SetLineWidth(2);
    shape.HideIcon();
    shape.SetTitle("MyRoute");
    shape.SetZIndex(1000, 2000);
    slRoute.AddShape(shape);

    for (var i = 0; i < route.RouteLegs.length; i++) {
        longLegs.push(route.RouteLegs[i].Time);
    }

    if (remainingRoute.length <= 1) {
        var time = beginTime;
        var i = 0;

        $('.ittime').each(function () {
            time += Math.round(longLegs[i] / 60);
            var next = time + wayhash[itinerary[i]].duration;

            $(this).html('(' + minToTime(time) + '-' + minToTime(next) + ')');
            time = next;
            i++;
        });

        // set end time
        var actualend = time + Math.round(longLegs[i] / 60);
        calculatedEnd = actualend;
        updateScheduleConstraints(actualend);

        if (actualend > endTime) {
            $('.endtime').last().html("<font color='red'>(" + minToTime(actualend) + ')</font>');
            //	$('#totaltriptime').html("<font color='red'>" + readMinutes(actualend - beginTime) + '</font>');
        } else {
            $('.endtime').last().html('(' + minToTime(actualend) + ')');

        }
        $('#totaltriptime').html(readMinutes(actualend - beginTime));
        longLegs = [];
        return;
    } else {


        GetLongRoute(remainingRoute);
    }
}

function GetMap() {
    mapCenter = new VELatLong(start.lat, start.long);
    map = new VEMap('mapDiv');
    var mapOptions = new VEMapOptions();
    mapOptions.DashboardColor = 'black';
    mapOptions.UseEnhancedRoadStyle = true;

    map.LoadMap(mapCenter, defaultZoom, 'r', false, VEMapMode.Mode2D, true, 0, mapOptions);
    map.HideScalebar();

    // layer for route
    slRoute = new VEShapeLayer();
    slRoute.SetTitle("slRoute");
    map.AddShapeLayer(slRoute);

    // Layer for find
    findLayer = new VEShapeLayer();
    findLayer.SetTitle("findLayer");
    map.AddShapeLayer(findLayer);

    // layer for waypoint pins
    waylayer = new VEShapeLayer();
    waylayer.SetTitle("waylayer");
    map.AddShapeLayer(waylayer);
}

function AddPushpin(m, ll, title, desc, canDrag, custom) {
    if (ll == null) ll = m.GetCenter();

    var shape = new VEShape(VEShapeType.Pushpin, ll);
    shape.SetTitle(title);
    shape.SetDescription(desc);
    if (custom != null) {
        shape.SetCustomIcon(custom);
    }
    m.AddShape(shape);
    shape.Draggable = canDrag;
    return shape;
}

function autoNearby() {
    if (!donearby) {
        donearby = true;
        return;
    }
    // puts nearby on new activity map
    var txt = $('#addactloc').val();
    if (txt == lastSearch) {
        return;
    } else {
        lastSearch = txt;
    }

    actfindLayer.DeleteAllShapes();
    try {
        newactmap.Find(txt, null, null, actfindLayer, 0, 10, true, true, true, true, processFind);    
    } catch (e) {
        alert(e.message);
    }
}

function editEndsNearby() {
    if (!donearby) {
        donearby = true;
        return;
    }

    // puts nearby on new activity map
    var txt = $(ontopname).val();

    if (txt == lastSearch) {
        return;
    } else {
        lastSearch = txt;
    }

    actfindLayer.DeleteAllShapes();
    try {
        newactmap.Find(txt, null, null, actfindLayer, 0, 10, true, true, true, true, processFind);
    } catch (e) {
        alert("h3");
        alert(e.message);
    }
}

function editAutoNearby() {
    if (!donearby) {
        donearby = true;
        return;
    }
    // puts nearby on new activity map
    var txt = $('#editactloc').val();
    if (txt == lasteditSearch) {
        return;
    } else {
        lasteditSearch = txt;
    }

    actfindLayer.DeleteAllShapes();
    try {
        newactmap.Find(txt, null, null, actfindLayer, 0, 10, true, true, true, true, processFind);
    } catch (e) {
        alert(e.message);
    }
}

function toler(tolerance) {
    // get something random between tolerance and 2x tolernace
    var ret;
    return tolerance + Math.random() * tolerance;
}

function randSign() {
    if (Math.random() > 0.5) {
        return 1;
    } else {
        return -1;
    }
}

function constraint(category, unit, compare, value) {
    this.cat = category;
    this.unit = unit;
    this.compare = compare;
    this.value = value;
}

function computeDistance(l1, l2) {
    return Math.sqrt((l1.Latitude - l2.Latitude) * (l1.Latitude - l2.Latitude) + (l1.Longitude - l2.Longitude) * (l1.Longitude - l2.Longitude));
}

function AddWaypointPin(si) {
    var ll = new VELatLong(si.data.location.lat, si.data.location.long);

    // check no pin already at same location
    var count = waylayer.GetShapeCount();
    for (var i = 0; i < count; i++) {
        var shape = waylayer.GetShapeByIndex(i);
        if (computeDistance(shape.GetPoints()[0], ll) < tolerance) {
            var dx = toler(tolerance) * randSign();
            var dy = toler(tolerance) * randSign();
            ll = new VELatLong(parseFloat(si.data.location.lat) + dx, parseFloat(si.data.location.long) + dy);
        }
    }


    if (computeDistance(startPin.GetPoints()[0], ll) < tolerance || computeDistance(endPin.GetPoints()[0], ll) < tolerance) {
        var dx = toler(tolerance) * randSign();
        var dy = toler(tolerance) * randSign();
        ll = new VELatLong(parseFloat(si.data.location.lat) + dx, parseFloat(si.data.location.long) + dy);
    }


    var shape = new VEShape(VEShapeType.Pushpin, ll);
	var desc = takeTill(si.data.description, 100);
	var addRemoveItineraryLink;
	if (itinerary.indexOf(si.id) != -1) {
		addRemoveItineraryLink = "<br/><br/><a href='#' onclick='removeActivityFromItineraryById(\"" + si.id + "\")' style='color:#0000CE; font-size:1.5em'>Remove from Itinerary</a>";
	} else {
		addRemoveItineraryLink = "<br/><br/><a href='#' onclick='addActivityToItineraryById(\"" + si.id + "\")' style='color:#0000CE; font-size:1.5em'>Add to Itinerary</a>";
	}

	if (state.inProgress && state.inter && ((si.data.start && si.data.start < state.inter.time) || (include(state.inter.keepActivities, si.id)))) {
        addRemoveItineraryLink = "";
    }
	
    shape.SetTitle(si.data.name);
    shape.SetDescription("<font color='black'>" + desc + "</font><br/>@" + si.data.location.name + "<br/><br/><a href='#' onclick='viewActivityById(\"" + si.id + "\")' style='color:#0000CE; font-size:1.5em'>Click to view or edit</a>" + addRemoveItineraryLink);
    //	      var str = "<div style='position: relative; background: url(" + custom + "); width:25px;height:29px'><div style='position: absolute; bottom: 0.5em; left: 0.5em; font-weight: bold; color: #fff;'>" + pos + '</div></div>'
    //	      var str2 = "<img src='" + custom + "'/><div style='color:#ffffff;position:absolute;left:5px; top:0px'>" + pos  + "</div>";
    //    var str3 = "<table width='30px' height='32px'><tr><td style='background: url(" + custom + ") no-repeat; vertical-align: top; text-align: center'><span style='font-weight: bold; color: #fff;'>" + pos + "</span></td></tr></table>";
    shape.SetCustomIcon(waypointIcon);
    shape.SetZIndex(1001);
    shape.Draggable = false;
    waylayer.AddShape(shape);
    wayhash[si.id] = new waypointPin(shape, ll, null, parseInt(si.data.duration));

	return shape;
}

function addActivityToItineraryById(id) {
	if (!enableEditting) {
		alert("Please accept the HIT before making any changes!");
		return;
	}
	if (oldShape) {
		waylayer.DeleteShape(oldShape);
	}
	addActivityToItinerary(getItem(id));
}

function removeActivityFromItineraryById(id) {
	if (!enableEditting) {
		alert("Please accept the HIT before making any changes!");
		return;
	}

    var index = itinerary.indexOf(id);

    if(index!==-1) {
        itinerary.splice(index, 1);
    }

	// remove shape
	waylayer.DeleteShape(wayhash[id].pin);
	// remove it from waypoint hash
	delete(wayhash[id]);
	
	removeItemFromId(id); // for calendar

	// get rid of the itinerary badge
	$('#ss_' + id).remove();

	// update display
	updateItineraryDisplay();

	saveItinerary();
}

function viewActivityById(id) {
	viewActivity(getItem(id));
}

function processFind(a, b, c, d, e) {
    if (b != null && b.length >= 1) {
        var shape;
        var numResults = a.GetShapeCount();
        for (var i = 0; i < a.GetShapeCount(); i++) {
            shape = a.GetShapeByIndex(i);
            shape.SetCustomIcon("../img/wp.gif");
            shape.SetDescription(shape.GetDescription() + "<br/><br/><a href='#' onclick='moveact(" + i + ")' style='color:#0000CE'>Move location pin here</a>");
        }
    }
}

function moveact(i) {
    newactpinMoved = true;
    var shape = actfindLayer.GetShapeByIndex(i);
    var overlap = false;
    e = newactPin;
    e.SetTitle(shape.GetTitle());
    e.SetPoints(shape.GetPoints());
    e.SetCustomIcon('../../img/pin-start.png');
    newactmap.SetCenter(shape.GetPoints()[0]);
    $(ontopname).val(shape.GetTitle());
}

function initMap() {
    GetMap();
    var startll = new VELatLong(start.lat, start.long);
    var endll = new VELatLong(end.lat, end.long);

    startPin = AddPushpin(map, startll, 'Start location', start.name, false, "../img/pin-start.png");

    if (computeDistance(startll, endll) < tolerance) {
        var dx = toler(tolerance) * randSign();
        var dy = toler(tolerance) * randSign();
        endll = new VELatLong(parseFloat(end.lat) + dx, parseFloat(end.long) + dy);
    }
    endPin = AddPushpin(map, endll, 'End location', end.name, false, "../img/pin-end.png");
}

var username = null;
var email = null;
var requestId = null;
var requestEmail = null;
var requestItem = null;
var state; // state of the world
var stateId = null;
var preferenceOrdering = null; // ordering on previous preferences
var userKeys = []; //todo, more efficient
var newFieldId = 0;
var newPreferenceId = 0;
var newChoices = [];
var newPreferences = [];
var planByCategory = true;

function minToTime(time) {
    if (time > 1440) time -= 1440;
    var AMPM = 'am';
    var minutes = time % 60;
    var hour = Math.floor(time / 60);

    // rounding for pretty display
    if (minutes % 10 >= 5) {
        minutes += (10 - (minutes % 10));
        if (minutes == 60) {
            minutes = 0;
            hour += 1;
        }
    } else if (minutes % 10 != 0) {
        minutes += (5 - (minutes % 10));
    }

    if (hour >= 12) {
        AMPM = 'pm';
        if (hour > 12) {
            hour -= 12;
        }
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    return hour + ":" + minutes + AMPM;
}

function streamitem(type, data, time) {
    this.type = type;
    this.data = data;
    if (time == null) {
        var t = new Date();
        this.createTime = t.getTime();
    } else {
        this.createTime = time;
    }
    this.value = data.name;
    this.label = [data.name, data.description, data.categories.join(' ')].join(' ');
    this.data.start = calBegin; // for calendar
}

function readMinutes(time) {
    var h = ' hour';
    var hs = '';
    var m = ' minute';
    var ms = '';

    var hour = Math.floor(time / 60);
    var minutes = time % 60;

    if (minutes > 1) {
        ms = 's';
    }
    if (hour > 1) {
        hs = 's';
    }

    if (hour == 0) {
        return minutes + m + ms;
    } else {
        if (minutes == 0) {
            return hour + h + hs;
        } else {
            return hour + h + hs + ' and ' + minutes + m + ms;
        }
    }
}

function addActivity() {
    // activity map
    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    // cleanup view activity stuff
    $('#addmapDiv').parentsUntil('#addActivity').andSelf().siblings().show();
	$("#pinDirections").show();
    newactmap.SetZoomLevel(defaultZoom);
    newactmap.SetCenter(mapCenter);

    viewactPin.Hide();
    newactPin.SetPoints([mapCenter]);
    newactPin.SetTitle('new activity');
    newactPin.SetDescription('');
    newactPin.SetCustomIcon("../img/pin-end.png");
    newactPin.onenddrag = OnTop('#addactloc');
    newactPin.Show();


    $('#addActivity').css('display', 'block');
    $('#addNote').css('display', 'none');
    $('#viewNote').css('display', 'none');
    $('#viewActivity').css('display', 'none');
    $('#viewCheck').hide();


    var txt = $('#searchBox').val();
    if (txt != emptyText) {
        $('#addacttitle').val(txt);
    } else {
        $('#addacttitle').val('');
    }

    $('#addactdesc').val('');
    $('#addactloc').val('');


    $('#addactduration').empty();
    actfindLayer.DeleteAllShapes();
    // options
    for (var i = 0; i < activityDurations.length; i++) {
        var o = $(document.createElement('option'));
        o.attr('value', activityDurations[i]);
        o.text(readMinutes(activityDurations[i]));
        $('#addactduration').append(o);
    }

    // categories
    $('#addacttags').empty();
    var s = $(document.createElement('table'));
    for (var i = 0; i < categories.length; i += 2) {
        var c;
        if (i == categories.length - 1) {
            c = "<tr><td><input type='checkbox' value='" + i + "' />" + categories[i] + "</td></tr>";
        } else {
            c = "<tr><td><input type='checkbox' value='" + i + "' />" + categories[i] + "</td>";
            c += "<td><input type='checkbox' value='" + (i + 1) + "' />" + categories[i + 1] + "</td></tr>";
        }
        s.append(c);
    }
    $('#addacttags').append(s);

    showBox();
}

function viewNote(si) {
    $('#box').css('left', '30%');
    $('#box').css('right', '30%');

    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').show();
    $('#viewActivity').hide();
    $('#viewCheck').hide();

    $('#viewtitle').html(si.data.name);
    $('#viewdesc').html(si.data.description);
    $('#viewtags').empty();
    for (var i = 0; i < si.data.categories.length; i++) {
        var d = ', ';
        if (i == si.data.categories.length - 1) {
            d = '';
        }
        var c = si.data.categories[i] + d;
        $('#viewtags').append('#' + c);
    }

    if (si.id.substring(0, 4) == 'user') {
        // edit button

        $('#editnotebutton').disabled = 'false';
        $('#editnotebutton').text('edit note');
        $('#editnotebutton').css('background', '#ffab07');
        $('#editnotebutton').unbind();
        $('#editnotebutton').click(function () {
            editNote(si);
        });
        $('#editnotebutton').show();
    } else {
        $('#editnotebutton').hide();
    }

    showBox();
}

function viewActivity(si) {
    //    alert(si.id);
    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    $('#addActivity').css('display', 'none');
    $('#addNote').css('display', 'none');
    $('#viewNote').css('display', 'none');
    $('#viewActivity').css('display', 'block');
    $('#viewCheck').hide();
	$("#pinDirections").hide();

    actfindLayer.DeleteAllShapes();
    $('#addActivity').show();

    $('#addmapDiv').show().parentsUntil('#addActivity').andSelf().siblings().hide();
    // hide theirs, show mine

    newactPin.Hide();
    var ll = new VELatLong(si.data.location.lat, si.data.location.long);

    //    newactmap.Resize();
    newactmap.SetZoomLevel(defaultZoom);
    newactmap.SetCenter(ll);

    viewactPin.SetPoints([ll]);
    viewactPin.SetTitle(si.data.name);
    viewactPin.SetDescription(si.data.description);
    viewactPin.Show();


    // check if item is already in itinerary
    if (include(itinerary, si.id)) {
        // make button disabled;
        //	$('#addacttoitbutton').disabled = 'true';
        $('#addacttoitbutton').text("remove from itinerary");
        $('#addacttoitbutton').css('background', '#ffab07');
        $('#addacttoitbutton').unbind();
        $('#addacttoitbutton').click(function () {
            removeActivityFromItineraryById(si.id);
            closeAdd();
        });
    } else {
        // enable the button
        $('#addacttoitbutton').disabled = 'false';
        $('#addacttoitbutton').text('add it to the itinerary');
        $('#addacttoitbutton').css('background', '#ffab07');
        $('#addacttoitbutton').unbind();
        $('#addacttoitbutton').click(function () {
            addActivityToItinerary(si);
            closeAdd();
        });
    }
	
	if (!enableEditting) {
		$('#addacttoitbutton').unbind();
        $('#addacttoitbutton').click(function () {
            alert("Please accept the HIT before making any changes!");
        });
	}

    // edit button
    $('#editacttoitbutton').disabled = 'false';
    $('#editacttoitbutton').text('edit activity');
    $('#editacttoitbutton').css('background', '#ffab07');
    $('#editacttoitbutton').unbind();
    $('#editacttoitbutton').click(function () {
        editActivity(si);
    });


    $('#viewacttitle').html(si.data.name);
    $('#viewactdesc').html(si.data.description);
    $('#viewactloc').html(si.data.location.name);
    $('#viewactduration').html(readMinutes(si.data.duration));
    $('#viewacttags').empty();
    for (var i = 0; i < si.data.categories.length; i++) {
        var d = ', ';
        if (i == si.data.categories.length - 1) {
            d = '';
        }
        var c = si.data.categories[i] + d;
        $('#viewacttags').append('#' + c);
    }

    showBox();
    
    $('#viewActivityMessage').hide();
    $('#addacttoitbutton').show();
    $('#editacttoitbutton').show();
    
    if (include(keepAct, si.id)) {
        $('#viewActivityMessage').show();
        $('#viewActivityMessage').text("The traveler likes this activity and doesn't want it to change.");
        $('#addacttoitbutton').hide();
        $('#editacttoitbutton').hide();
    }
    
    if (include(finishedAct, si.id)) {
        $('#viewActivityMessage').show();
        $('#viewActivityMessage').text('The traveler has already done this activity today.');
        $('#addacttoitbutton').hide();
        $('#editacttoitbutton').hide();
    }
}

function getLocations() {
    // look through all the data we have to get locations of those places
    var namedlocations = userStream.filter(function (x) {
        return x.type == 'activity';
    });

    return namedlocations.map(function (x) {
        x.label = x.data.location.name;
        x.value = x.data.location.name;
        return x;
    });
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function editMission() {
    showRequirements();

    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    $('#viewMission').hide();
    $('#editMission').show();

    $('#saveeditmissionbutton').unbind();
    $('#saveeditmissionbutton').click(function () {

        var collectedConstraints = getConstraints('tour_verbal', 'preferenceSet');
        if (collectedConstraints == -1) {
            alert("One of your requirements contains a non-numeric entry for the number of hours or activities. Please fix this before continuing.");
            return;
        }

        description = $('#editmissiondescription').val();
        $('#description').html(description);
        var allCategories = getCategories();
        if (allCategories.length > categories.length) {
            var tag;
            categories = allCategories;
            // do tag row
            $('#tagrow').html("");
            for (var i = 0; i < categories.length; i++) {
                tag = "<span style='white-space:no-wrap;'><a class='tagrowitem' href='#' onclick=" + "\"filterOnTag('" + categories[i] + "')\">" + '#' + categories[i] + "</a></span>";
                $('#tagrow').append(tag); // + '&nbsp;&nbsp;');
            }
            // add one for system todo
            tag = "<a class='tagrowitem' href='#' onclick=" + "\"filterOnTag('" + "todo" + "')\">" + '#' + "todo" + "</a>";
            $('#tagrow').append(tag);

            // add one for activities
            tag = "<a class='tagrowitem' href='#' onclick=" + "\"filterOnTag('" + "activity" + "')\">" + '#' + "activity" + "</a>";
            $('#tagrow').append(tag);

            // add one for notes
            tag = "<a class='tagrowitem' href='#' onclick=" + "\"filterOnTag('" + "note" + "')\">" + '#' + "note" + "</a>";
            $('#tagrow').append(tag);
        }

        // now let's do the constraints
        constraints = collectedConstraints;
        // process constraints
        constraintsFunc = [];
        for (var i = 0; i < constraints.length; i++) {
            constraintsFunc.push(generatePredicate(constraints[i]));
        }
        displayConstraints();
        updateSysStream();
        if (calculatedEnd != null) {
            updateScheduleConstraints(calculatedEnd);
        }
        //	alert(JSON.stringify(categories));
        //	alert(JSON.stringify(collectedConstraints));
        // reload the constraints..
        saveEditMission();
    });

    // add description
    $('#editmissiondescription').val(description);
    // add existing tags
    $('#editmissionexistingtags').html("");
    for (var i = 0; i < categories.length - 1; i++) {
        $('#editmissionexistingtags').append("<span>" + categories[i] + "</span>, ")
    }
    $('#editmissionexistingtags').append("<span>" + categories[i] + "</span> ")
    $('#tour_categories').html("");
    $('#tour_verbal').html("");
    // add constraint fields
    for (var i = 0; i < constraints.length; i++) {
        createConstraintField('tour_verbal', 'preferenceSet', '', 100, constraints[i]);
    }

    showBox();
}

function getConstraints(field, name) {
    var compares = new Array();
    var key = "#" + field + " :input[name=\"" + 'compare' + name + "\"]";
    var compareInputs = $(key);
    compareInputs.each(function () {
        //   if($(this).val() != ""){
        compares.push($(this).val());
        //   }
    });

    var units = new Array();
    var key = "#" + field + " :input[name=\"" + 'unit' + name + "\"]";
    var unitInputs = $(key);
    unitInputs.each(function () {
        //  if($(this).val() != ""){
        units.push($(this).val());
        //  }
    });


    var categories = new Array();
    var key = "#" + field + " :input[name=\"" + 'category' + name + "\"]";
    var categoryInputs = $(key);
    categoryInputs.each(function () {
        //  if($(this).val() != ""){
        categories.push($(this).val());
        // }
    });



    var vals = new Array();
    var key = "#" + field + " :input[name=\"" + 'val' + name + "\"]";
    var valInputs = $(key);
    valInputs.each(function () {
        //  if($(this).val() != ""){
        vals.push($(this).val());
        // }
    });

    // put it all together
    var inputsList = [];
    for (var i = 0; i < vals.length; i++) {
        if (categories[i] == "" || units[i] == "" || compares[i] == "" || vals[i] == "") {
            // empty field not legal
            continue;
        }
        // check values are numbers to ensure legal
        if (!isNumber(vals[i])) {
            return -1;
        }
        if (units[i] == 'hours') {
            inputsList.push(new constraint(categories[i], units[i], compares[i], parseFloat(vals[i])));
        } else if (units[i] == 'activities') {
            inputsList.push(new constraint(categories[i], units[i], compares[i], parseInt(vals[i])));
        }
    }
    return inputsList;
}

function removeField(e) {
    var index;
    var ediv = jQuery(e).closest('div');
    index = $('.containcategorySet').index(ediv);
    var v = $($('input[name="categorySet"]')[index]).val();

    var reqs = $('select[name="categorypreferenceSet"]');
    ediv.remove();
    reqs.each(function () {
        if ($(this).val() == v) {
            // these requirements should disappear
            removeRequirement($(this));
        }
    });

    removeOption(v);
}

function removeOption(n) {
    $('select[name="categorypreferenceSet"] > option[value="' + n + '"]').remove();
}

function refreshOptions(e) {
    var count = $('#tour_categories' + ' :input[name="categorySet"]').index(e) + categories.length;

    $('select[name="categorypreferenceSet"]').each(function () {
        $($(this).children()[count]).val($(e).val());
        $($(this).children()[count]).text($(e).val());
    });
}

function createField(field, name, val, size) {
    var div = $(document.createElement('div'));
    div.attr('class', 'contain' + name);
    var c = "<input type=\"text\" name=\"" + name + "\" value=\"" + val + "\" onkeyup=\"refreshOptions(this)\" size=\"" + size + "\"/>&nbsp; <img src='../img/exit.png' width='11' style='vertical-align:middle;margin-right:20px' onclick='removeField(this)'>";

    var fname = '#' + field;

    //  if(numTags % 2 == 0){
    //      $(fname).append("&nbsp;&nbsp;&nbsp;" + c + "&nbsp;&nbsp;&nbsp;");
    // }else{
    $(div).append(c + "<br/>");
    // }
    numTags++;
    $(fname).append(div);

    // append this as a new option
    var o = $(document.createElement('option'));
    o.val("");
    o.text("");
    $('select[name="categorypreferenceSet"]').append(o);
}

function createConstraintField(field, name, val, size, stuff) {
    var container = '#' + field;
    var fname = $(document.createElement('div'));
    fname.attr('class', 'contain' + name);
    $(fname).append("&nbsp;&nbsp;&nbsp;I want ");
    if (stuff == null) {
        $(fname).append(createSelectField('compare' + name, ['at most', 'at least', 'exactly'], '80px', null));
    } else {
        $(fname).append(createSelectField('compare' + name, ['at most', 'at least', 'exactly'], '80px', stuff.compare));
    }
    $(fname).append("&nbsp;");
    var ix = $(document.createElement('input'));
    ix.attr('name', 'val' + name);
    ix.attr('type', 'text');
    ix.attr('size', '10');
    if (stuff != null) {
        ix.val(stuff.value);
    }
    $(fname).append(ix);
    $(fname).append("&nbsp;");
    if (stuff == null) {
        $(fname).append(createSelectField('unit' + name, ['hours', 'activities'], '80px', null));
    } else {
        $(fname).append(createSelectField('unit' + name, ['hours', 'activities'], '80px', stuff.unit));
    }
    $(fname).append(' on ');
    if (stuff == null) {
        $(fname).append(createSelectField('category' + name, getCategories(), '200px', null));
    } else {
        $(fname).append(createSelectField('category' + name, getCategories(), '200px', stuff.cat));
    }
    $(fname).append("&nbsp; <img src='../img/exit.png' width='11' style='vertical-align:middle;margin-right:20px' onclick='removeRequirement(this)'>");
    $(fname).append("<br/>");
    $(container).append(fname);
}

function showRequirements() {
    $('#tagtab').removeClass("selected");
    $('#reqtab').addClass("selected");
    $('#tagcontent').hide();
    $('#requirementcontent').show();

}

function showTags() {
    $('#tagtab').addClass("selected");
    $('#reqtab').removeClass("selected");
    $('#tagcontent').show();
    $('#requirementcontent').hide();
}

function getCategories() {
    var inputsList = new Array();
    var inputs = $('#tour_categories' + ' :input[name="categorySet"]');
    inputs.each(function () {
        //	if($(this).val() != ""){
        inputsList.push($(this).val());
        //	}
    });
    return categories.concat(inputsList);
}

function removeRequirement(e) {
    var index;
    var ediv = jQuery(e).closest('div');
    index = jQuery('.requirementSet').index(ediv);
    ediv.remove();
}

function createSelectField(name, opts, w, v) {
    var s = $(document.createElement('select'));
    s.attr('name', name);
    s.css('width', w);
    for (var i = 0; i < opts.length; i++) {
        var o = $(document.createElement('option'));
        o.val(opts[i]);
        o.text(opts[i]);
        if (v != null && opts[i] == v) {
            o.attr('selected', 'selected');
        }
        s.append(o);
    }
    return s;
}

function editActivity(si) {
    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewActivity').hide();
    $('#viewCheck').hide();

    $('#editActivity').show();

    $('#addActivity').show();
    $('#addmapDiv').show().parentsUntil('#addActivity').andSelf().siblings().hide();
	$("#pinDirections").show();

    actfindLayer.DeleteAllShapes();
    // hide theirs, show mine
    viewactPin.Hide();

    var ll = new VELatLong(si.data.location.lat, si.data.location.long);
    newactPin.SetPoints([ll]);
    newactPin.SetTitle(si.data.name);
    newactPin.SetDescription(si.data.description);
    newactPin.SetCustomIcon("../img/pin-end.png");
    newactPin.onenddrag = OnTop('#editactloc');
    newactPin.Show();
    newactmap.SetCenter(ll);

    $('#saveeditbutton').unbind();
    $('#saveeditbutton').click(function () {
        saveEditActivity(si);
    });

    $('#editacttitle').val(si.data.name);
    $('#editactdesc').val(si.data.description);
    $('#editactloc').val(si.data.location.name);

    // options
    $('#editactduration').empty();
    for (var i = 0; i < activityDurations.length; i++) {
        var o = $(document.createElement('option'));
        o.attr('value', activityDurations[i]);
        o.text(readMinutes(activityDurations[i]));
        if (activityDurations[i] == si.data.duration) {
            o.attr('selected', 'selected');
        }

        $('#editactduration').append(o);
    }

    // location, autocomplete
    if (editlocationAutocomplete == null) {
        editlocationAutocomplete = $("input#editactloc").autocomplete({
            minLength: 2,
            source: campuslocations,
            select: function (event, ui) {
                donearby = false;
                actfindLayer.DeleteAllShapes();
                var loc = ui.item;
                $('#editactloc').val(loc.data.name);
                var latlong = new VELatLong(loc.data.lat, loc.data.lng);
                newactPin.SetPoints([latlong]);
                newactPin.SetTitle(loc.data.name);
                newactPin.SetCustomIcon('../img/pin-start.png');
                newactmap.SetCenter(latlong);
                newactpinMoved = true;
                return false;
            }

        });
    }

    // categories
    $('#editacttags').empty();
    var s = $(document.createElement('table'));
    for (var i = 0; i < categories.length; i += 2) {
        var c;
        var d;
        var d1;
        var d2;
        if (i == categories.length - 1) {
            if (include(si.data.categories, categories[i])) {
                d = "<input type='checkbox' value='" + i + "' checked/>" + categories[i];
            } else {
                d = "<input type='checkbox' value='" + i + "' />" + categories[i];
            }
            c = "<tr><td>" + d + "</td></tr>";
        } else { // have two things
            if (include(si.data.categories, categories[i])) {
                d1 = "<input type='checkbox' value='" + i + "' checked/>" + categories[i];
            } else {
                d1 = "<input type='checkbox' value='" + i + "' />" + categories[i];
            }

            if (include(si.data.categories, categories[i + 1])) {
                d2 = "<input type='checkbox' value='" + (i + 1) + "' checked/>" + categories[i + 1];
            } else {
                d2 = "<input type='checkbox' value='" + (i + 1) + "' />" + categories[i + 1];
            }
            c = "<tr><td>" + d1 + "</td>";
            c += "<td>" + d2 + "</td></tr>";
        }
        s.append(c);
    }
    $('#editacttags').append(s);

    showBox();
}

function editNote(si) {
    $('#box').css('left', '30%');
    $('#box').css('right', '30%');

    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewActivity').hide();
    $('#viewCheck').hide();
    $('#editNote').show();

    $('#saveeditnotebutton').unbind();
    $('#saveeditnotebutton').click(function () {
        saveEditNote(si);
    });

    $('#edittitle').val(si.data.name);
    $('#editdesc').val(si.data.description);

    // categories
    $('#edittags').empty();
    for (var i = 0; i < categories.length; i++) {
        var c;
        if (include(si.data.categories, categories[i])) {
            c = "<input type='checkbox' value='" + i + "' checked/>" + categories[i] + "<br/>";
        } else {
            c = "<input type='checkbox' value='" + i + "' />" + categories[i] + "<br/>";
        }
        $('#edittags').append(c);
    }

    showBox();
}

function addActivityToItinerary(si) {
	// update itinerary ordering in actual data
    itinerary.unshift(si.id);

    // add the waypoint
    AddWaypointPin(si);

    // update stream to say it's in itinerary
    $('#stime_' + si.id).append(createInItineraryButton(si));

    saveItinerary();

    updateItineraryDisplay();

	si.data.start = calBegin;
    addNewItemFromId(si.id, true); // for calendar
	updateItineraryOnCalendar();
}

function addSelect() {
    // display mission details;
    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewHelp').hide();
    $('#viewActivity').hide();
    $('#viewMission').hide();
    $('#signup').hide();

    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    $('#viewSelect').show();

    showBox();
}

function addNote() {
    $('#box').css('left', '30%');
    $('#box').css('right', '30%');

    $('#addActivity').hide();
    $('#addNote').show();
    $('#viewNote').hide();
    $('#viewActivity').hide();

    var txt = $('#searchBox').val();
    if (txt != emptyText) {
        $('#addtitle').val(txt);
    } else {
        $('#addtitle').val('');
    }

    $('#adddesc').val('');
    $('#addtags').empty();
    for (var i = 0; i < categories.length; i++) {
        var c = "<input type='checkbox' value='" + i + "' />" + categories[i] + "<br/>";
        $('#addtags').append(c);
    }

    showBox();
}

function saveAddNote() {
    var nname = $('#addtitle').val();
    if (rtrim(nname) == '') {
        alert("Please enter a title");
        return;
    }
    var ndesc = $('#adddesc').val();
    var ncat = ['note'];
    $('#addtags input:checked').each(function () {
        ncat.push(categories[$(this).val()]);
    });
    var n = new note(nname, ndesc, ncat);
    var si = new streamitem('note', n, null);
    si.edited = [uid];

    //// save it 
    var id = submitEntry(si);
    //    alert(id);
    si.id = 'user_' + id;

    // add it to local stream
    userStream.unshift(si);
    searchAutocomplete.autocomplete("option", "source", userStream);

    var item = createStreamItem(si);
    $('#userStreamBody').prepend(item);
    //    item.insertAfter($('#brainstream tbody tr').last());

    closeAdd();
}

function saveEditActivity(oldsi) {
    var oldid = oldsi.id;

    // name
    var nname = $('#editacttitle').val();
    if (rtrim(nname) == '') {
        alert("Please enter a title");
        return;
    }

    newactpinMoved = false;

    // location
    var coord = newactPin.GetPoints()[0];
    var nloc = new locationInfo($('#editactloc').val(), coord.Latitude, coord.Longitude);
    var ndur = $('#editactduration').val();

    var ndesc = $('#editactdesc').val();
    var ncat = ['activity'];
    $('#editacttags input:checked').each(function () {
        ncat.push(categories[$(this).val()]);
    });

    var n = new activity(nname, ndesc, null, nloc, null, ndur, ncat);

    var si = new streamitem('activity', n, null);
    si.data.start = oldsi.data.start; // for calendar

    if (oldsi.edited == undefined) {
        si.edited = [uid];
    } else {
        si.edited = oldsi.edited;
        si.edited.push(uid);
    }

    /// submit it
    var id = submitEdit(si, oldid);
    if (id != null) {
        si.id = 'user_' + id;
    } else {
        closeAdd();
        return;
    }

    // add it to local stream
    userStream.unshift(si);
    searchAutocomplete.autocomplete("option", "source", userStream);

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

        updateItineraryDisplay();
    
        updateEditCalendar(oldid, si.id); // for calendar
    }
    
    closeAdd();
}

function saveEditNote(oldsi) {

    // name
    var nname = $('#edittitle').val();
    if (rtrim(nname) == '') {
        alert("Please enter a title");
        return;
    }

    var ndesc = $('#editdesc').val();
    var ncat = ['note'];
    $('#edittags input:checked').each(function () {
        ncat.push(categories[$(this).val()]);
    });

    var n = new note(nname, ndesc, ncat);
    var si = new streamitem('note', n, null);

    if (oldsi.edited == undefined) {
        si.edited = [uid];
    } else {
        si.edited = oldsi.edited;
        si.edited.push(uid);
    }

    /// submit the edit
    var newid = submitEdit(si, oldsi.id);
    if (newid != null) {
        si.id = 'user_' + newid;
    } else {
        closeAdd();
        return;
    }

    // add it to local stream
    userStream.unshift(si);
    searchAutocomplete.autocomplete("option", "source", userStream);

    var item = createStreamItem(si);
    $('#userStreamBody').prepend(item);

    // remove the old one
    // 1. remove from stream
    $('#stream_' + oldsi.id).remove();
    // 2. remove from userStream

    for (var i = 0; i < userStream.length; i++) {
        if (userStream[i].id == oldsi.id) {
            userStream.splice(i, 1);
            break;
        }
    }

    closeAdd();
}

function saveAddActivity(streamonly) {
    // name
    var nname = $('#addacttitle').val();
    if (rtrim(nname) == '') {
        alert("Please enter a title");
        return;
    }

    // check if location pin moved
    if (!newactpinMoved) {
        var answer = confirm("It seems like you didn't move the location pin. Are you sure you want to continue?");
        if (answer) {} else {
            return;
        }
    }

    newactpinMoved = false;

    // location
    var coord = newactPin.GetPoints()[0];
    var nloc = new locationInfo($('#addactloc').val(), coord.Latitude, coord.Longitude);
    var ndur = $('#addactduration').val();

    var ndesc = $('#addactdesc').val();
    var ncat = ['activity'];
    $('#addacttags input:checked').each(function () {
        ncat.push(categories[$(this).val()]);
    });

    var n = new activity(nname, ndesc, null, nloc, null, ndur, ncat);

    var si = new streamitem('activity', n, null);
    si.edited = [uid];
    /// submit it
    //    alert("Save add activity");
    var id = submitEntry(si);
    //    alert(id);
    si.id = 'user_' + id;
    //si.data.start = calBegin; // for calendar

    // add it to local stream
    userStream.unshift(si);
    searchAutocomplete.autocomplete("option", "source", userStream);

    var item = createStreamItem(si);
    $('#userStreamBody').prepend(item);

    closeAdd();

    if (!streamonly) {
        // also add to itinerary
        addActivityToItinerary(si);
    }
}

function waypointPin(pin, ll, pos, duration) {
    this.pin = pin;
    this.pos = pos;
    this.ll = ll;
    this.duration = duration;
}

function updatePinNumber(pin, pos) {
    var str = "<table><tr><td><div class='pinpos'>" + pos + "</div></td></tr></table>";
    pin.SetCustomIcon(str);
}

// save stream item on server, and then return its id
function submitEntry(si) {
	if(!enableEditting){
		alert("You must accept the HIT before you can save any edits.");
		return;
    }
	
    var ret = null;
    jQuery.ajax({
        type: "POST",
        url: "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/submitTurkTourEntry.php",
        async: false,
        data: ({
            userId: uid,
            answer: JSON.stringify(si),
            taskId: tid,
            assignmentId: assignmentId,
            type: "turktour"
        }),
        success: function (msg) {
            ret = msg;
            ret = ret.replace(/(\r\n|\n|\r)/gm, "");

        }
    });

	madeChange = true;
    updateSubmit();
    return ret;
}

// save stream item on server, and then return its id
function submitEdit(si, oldid) {
    oldid = parseInt(oldid.substring(5));

	if(!enableEditting){
		alert("You must accept the HIT before you can save any edits.");
		return;
    }
	
    var ret = null;
    jQuery.ajax({
        type: "POST",
        url: "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/submitTurkTourEdit.php",
        async: false,
        data: ({
            userId: uid,
            answer: JSON.stringify(si),
            oldid: oldid,
            taskId: tid,
            assignmentId: assignmentId,
            type: "turktour"
        }),
        success: function (msg) {
            if (msg == "") {
                // cannot save it
                alert("It appears that someone else has recently edited the same thing that you are editing. Please refresh the page before continuing. We apologize for the inconvenience");

                //alert(msg);
                // ret = msg;
            } else {
                ret = rtrim(msg);
                ret = ret.replace(/(\r\n|\n|\r)/gm,"");
				madeChange = true;
				updateSubmit();
            }
        }
    });

    return ret;
}

function locationInfo(name, lat, long) {
    this.name = name;
    this.lat = lat;
    this.long = long;
}

function createStreamItem(si) {
    var item = $(document.createElement('tr'));
    item.addClass(si.type);

    var msg = $(document.createElement('td'));

    msg.css('width', '100%');
    msg.append('<b>' + si.data.name + '</b>');
    msg.append('<br/>');
    var desc = takeTill(si.data.description, 100);

    var descntag = $(document.createElement('div'));
    descntag.addClass('sidesc');
    descntag.append(desc);

    descntag.append('<br/>');

    for (var i = 0; i < si.data.categories.length; i++) {
        descntag.append("<span style='float:left;white-space:no-wrap;'><a class='tagstreamitem' href='#' onclick=" + "\"filterOnTag('" + si.data.categories[i] + "')\">" + '#' + si.data.categories[i] + "</a></span>");
    }

    msg.append(descntag);

    var time = $(document.createElement('td'));
    time.css('width', '0%');
    time.attr('id', 'stime_' + si.id);
    var tt = $(document.createElement('div'));
    tt.addClass('badge_' + si.type);
    time.append(tt);

    if (include(itinerary, si.id)) {
        time.prepend(createInItineraryButton(si));
    }

    item.append(msg);
    item.append(time);


    $(item).click(function () {
        openItem(si);
    });
    $(item).attr('id', 'stream_' + si.id);
    return item;
}

function createInItineraryButton(si) {
    var sp = $(document.createElement('div'));
    sp.attr('id', 'ss_' + si.id);
    sp.addClass('sspinpos');

    if (wayhash[si.id] != undefined) {
        sp.append(wayhash[si.id].pos);
    }
    return sp;
}

// opens up the time for viewing, or additional editting
var oldShape = undefined;

function openItem(item) {
    if (item.type == 'note' || item.type == 'todo') {
        viewNote(item);
    } else if (item.type == 'activity') {
		if (oldShape) {
			waylayer.DeleteShape(oldShape);
		}
		if (include(itinerary, item.id)) {
			var dumby = {};
			dumby.itId = item.id;
			eventClick(dumby, dumby, dumby);
		} else {	
			oldShape = AddWaypointPin(item);
			map.SetCenter(new VELatLong(item.data.location.lat, item.data.location.long));
			map.SetCenter(new VELatLong(item.data.location.lat, item.data.location.long));
			$("a[id^=" + oldShape.GetID() + "] div").mouseover();
		}
    }
}

// getter for locating an item
function getItem(id) {
    var stream;
    if (id.substring(0, 4) == 'user') {
        stream = userStream;
    } else {
        stream = sysStream;
    }
    
    // return just the first element (since they are actually unique)
    var arr = stream.filter(function (x) {
        return x.id == id;
    });
    
    if (arr != null && arr.length > 0) {
        return arr[0];
    } else {
        return null;
    }

}

function displayStreamItem(id, si) {
    var item = createStreamItem(si);
    $(id).prepend(item);
}

function rtrim(stt) {
    return stt.replace(/\s+$/, "");
}

function takeTill(str, maxchars) {
    var str = rtrim(str.replace(/<br\/>/g, ' '));

    var sp = str.split(' ');
    var o = '';
    for (var i = 0; i < sp.length; i++) {
        if (o.length + sp[i].length > maxchars) {
            var ret = rtrim(o) + ' [...]';
            return ret;
        } else {
            o += sp[i];
            o += ' ';
        }
    }
    return rtrim(str);
}

function loadStream() {
    jQuery.ajax({
        type: "GET",
        dataType: "json",
        url: "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/loadTurkTourStream.php",
        data: ({
            type: "turktour",
            id: tid
        }),
        async: false,
        success: function (obj) {
            if (obj == "") {} else {
                var count = 0;
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].changeInfo == null) {
						obj[i].answer = obj[i].answer.replace(/Â/g, "");
						obj[i].answer = obj[i].answer.replace(/Ã/g, "");
						obj[i].answer = obj[i].answer.replace(/Â/g, "");
                        userStream.push(eval('(' + obj[i].answer + ')'));
                        userStream[count].id = 'user_' + obj[i].hitId;
                        count++;
                    }
                }
            }
        }
    });
    return;
}

function locateCategoryIndex(c) {
    for (var i = 0; i < categories.length; i++) {
        if (categories[i] == c) return i;
    }

    return -1;
}

function loadUserData() {

    // check not null
    if(uid == null) return;

    jQuery.ajax({
        type: "GET",
        // dataType: "json", 
        url: "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/loadTurkAdminUserInfo.php",
        data: ({
            type: "turktour",
            userId: uid,
            taskId: tid
        }),
        async: false,
        success: function (obj) {
            //	    alert(JSON.stringify(obj));
            if (obj == "") {} else {
                var userArr = eval('(' + obj + ')');
                numUsers = userArr.length;
                for (var i = 0; i < userArr.length; i++) {
                    userKeys[userArr[i]['userId']] = userArr[i]['name'];

                    if (userArr[i]['userId'] == uid) {
                        user = userArr[i];
                    }
                }
            }
        }
    });


}

function activity(name, description, commentary, location, subactivities, duration, categories) {
    this.name = name;
    this.description = description;
    this.commentary = commentary;
    this.location = location;
    this.subactivities = subactivities;
    this.duration = duration;
    this.categories = categories;
}

function note(name, description, categories) {
    this.name = name;
    this.description = description;
    this.categories = categories;
}

function problemStatement(constraint, predData) {
    var statement;
    var unit = constraint.unit;
    if (constraint.value == 1 && constraint.unit == 'hours') {
        unit = 'hour';
    } else if (constraint.value == 1 && constraint.unit == 'activities') {
        unit = 'activity';
    }

    var value = predData.value;
    if (value == 0) {
        value = 'no';
    }

    if (constraint.unit == 'hours') {
        statement = 'We need ' + constraint.compare + ' ' + constraint.value + ' ' + unit + ' of ' + constraint.cat + '.' + ' The current itinerary contains ';
        if (value == 'no') {
            statement += "no " + constraint.cat + '.';
        } else {
            statement += readMinutes(Math.round(predData.value * 60)) + " of " + constraint.cat + ". ";
        }
    } else {
        statement = 'We need ' + constraint.compare + ' ' + constraint.value + ' ' + constraint.cat + ' ' + unit + '.' + ' The current itinerary contains ' + value + ' ' + constraint.cat + ' activities. ';
    }

    if (value != 'no') {
        statement += "<br/><br/>The following " + constraint.cat + " activities are in the current itinerary: <br/>";

        for (var i = 0; i < predData.activities.length; i++) {
            statement += (i + 1) + ". " + predData.activities[i].name + " &nbsp;[" + readMinutes(predData.activities[i].duration) + "]<br/>";
        }
    }

    return statement;
}

function updateSysStream() {
    $('#replanStreamBody').empty();
    $('#sysStreamBody').empty();
    sysStream.length = 0;

    var itineraryItems = [];
    for (var i = 0; i < itinerary.length; i++) {
        var si = getItem(itinerary[i]);
        itineraryItems.push(si);
    }
    // check predicates
    for (var i = 0; i < constraintsFunc.length; i++) {
        var predData = constraintsFunc[i](itineraryItems);
        if (!predData.response) {
            // add it to stream
            var problem = problemStatement(constraints[i], predData);

            var n = new note(predData.explain,
            problem, ['todo', constraints[i].cat]);
            var si = new streamitem('todo', n, null);
            si.id = 'sys_' + i;
            sysStream.push(si);
        }
    }

    for (var i = 0; i < sysStream.length; i++) {
        displayStreamItem('#sysStreamBody', sysStream[i]);
    }
}

function loadStateIntoInterface() {
    // set up itinerary
    itinerary = state.itinerary;
	
    var itineraryItems = [];
    for (var i = 0; i < itinerary.length; i++) {
        itinerary[i] = itinerary[i].replace(/(\r\n|\n|\r)/gm,"");
        var si = getItem(itinerary[i]);
        itineraryItems.push(si);
    }

    /// display the user stream;
    for (var i = 0; i < userStream.length; i++) {
        displayStreamItem('#userStreamBody', userStream[i]);
    }

    for (var i = itineraryItems.length - 1; i >= 0; i--) {
        var si = itineraryItems[i];

        // add the waypoint
        AddWaypointPin(si);
    }

    updateItineraryDisplay();

    ///////// TAGS////////////
    var tag;

    // do tag row
    for (var i = 0; i < categories.length; i++) {
        tag = "<span style='white-space:no-wrap;'><a class='tagrowitem' href='#' onclick=" + "\"filterOnTag('" + categories[i] + "')\">" + '#' + categories[i] + "</a></span>";
        $('#tagrow').append(tag); // + '&nbsp;&nbsp;');
    }
    // add one for system todo
    tag = "<a class='tagrowitem' href='#' onclick=" + "\"filterOnTag('" + "todo" + "')\">" + '#' + "todo" + "</a>";
    $('#tagrow').append(tag);

    // add one for activities
    tag = "<a class='tagrowitem' href='#' onclick=" + "\"filterOnTag('" + "activity" + "')\">" + '#' + "activity" + "</a>";
    $('#tagrow').append(tag);

    // add one for notes
    tag = "<a class='tagrowitem' href='#' onclick=" + "\"filterOnTag('" + "note" + "')\">" + '#' + "note" + "</a>";
    $('#tagrow').append(tag);
}

function filterOnTag(tag) {
    var user = userStream.filter(function (x) {
        return include(x.data.categories, tag);
    });
    var sys = sysStream.filter(function (x) {
        return include(x.data.categories, tag);
    });

    $('#sysStreamBody').empty();
    $('#userStreamBody').empty();

    for (var i = 0; i < sys.length; i++) {
        displayStreamItem('#sysStreamBody', sys[i]);
    }

    for (var i = 0; i < user.length; i++) {
        displayStreamItem('#userStreamBody', user[i]);
    }

    $('#braintitle').html("results for #" + tag + ":");
    $('#showall').show();
}

function unfilterOnTag() {
    var user = userStream;
    var sys = sysStream;

    $('#sysStreamBody').empty();
    $('#userStreamBody').empty();

    for (var i = 0; i < sys.length; i++) {
        displayStreamItem('#sysStreamBody', sys[i]);
    }

    for (var i = 0; i < user.length; i++) {
        displayStreamItem('#userStreamBody', user[i]);
    }
    $('#braintitle').html("<span style='color:#0000CE'>Our brainstream</span><span class='sectioninstruction'>&nbsp;(click for details)</span>");
    $('#showall').hide();
}

function saveEditMission() {
    var ret = true;
    jQuery.ajax({
        type: "POST",
        url: "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/submitSubjectMission.php",
        async: false,
        data: ({
            userId: uid,
            taskId: tid,
            description: description,
            constraints: JSON.stringify(constraints),
            categories: JSON.stringify(categories),
            type: "tour"
        }),
        success: function (msg) {
            if (msg == "") {
                // cannot save it
                alert("It appears that someone else has recently made a change that conflicts with the changes you are trying to save. Please refresh the page before continuing. We apologize for the inconvenience");
                ret = false;
                return;
            } else {
                unsavedChanges = false;
            }
        }
    });

    closeAdd();
    return ret;
}

function saveItinerary() {
	if(!enableEditting){
		alert("Please accept the HIT before making any edits!");
		return;
    }

    state.itinerary = itinerary;

    var ret = true;

    jQuery.ajax({
        type: "POST",
        url: "https://people.csail.mit.edu/jrafidi/Crowdcierge/mobi/submitTurkTourItinerary.php",
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
				madeChange = true;
				updateSubmit();
                unsavedChanges = false;
            }
        }
    });
    return ret;
}

function updateScheduleConstraints(actualend) {
    var si;
    var freetime = endTime - actualend;
    var allowedEmpty = .05 * (endTime - beginTime);

    if (freetime > allowedEmpty) { // have time left
        var problem = "There is still " + readMinutes(freetime) + ' left empty in the itinerary. The trip can go till ' + minToTime(endTime) + '.';
        // but currently ends at ' + minToTime(actualend);
        var n = new note("Add to the itinerary or spend more time on existing activities",
        problem, ['todo', 'time']);
        si = new streamitem('todo', n, null);
        si.id = 'sys_have_time_left';
    } else if (freetime < 0) { // no time left
        var problem = 'Try reordering activities in the itinerary to save time. You can also edit or remove activities. The trip should end by ' + minToTime(endTime) + '.';

        var n = new note("The itinerary is over time",
        problem, ['todo', 'time']);
        si = new streamitem('todo', n, null);
        si.id = 'sys_no_time_left';
    } else {
        return;
    }
    
    if (inProgress) {
        //displayStreamItem("#replanStreamBody", si);
    } else {
        displayStreamItem("#sysStreamBody", si);
    }

    var checkexist = false;
    for (var i = 0; i < sysStream; i++) {
        // check if already in there
        if (sysStream[i].id = 'sys_no_time_left' || sysStream[i].id == 'sys_have_time_left') {
            sysStream[i] = si;
            checkexist = true;
        }
    }
    if (!checkexist) {
        sysStream.push(si);
    }
    return;
}

function displaySingleConstraint(i) {
    var cat = constraints[i].cat;
    var unit = constraints[i].unit;
    var compare = constraints[i].compare;
    var v = constraints[i].value;
    var str = '';
    if (unit == 'hours') {
        if (v == 1) {
            str = 'spend ' + compare + ' ' + v + ' hour' + ' ' + 'on ' + "<u>" + cat + "</u>.";
        } else {
            str = 'spend ' + compare + ' ' + v + ' ' + unit + ' ' + 'on ' + "<u>" + cat + "</u>.";
        }
    } else if (unit == 'activities') {
        if (v == 1) {
            str = 'have ' + compare + ' ' + v + " <u>" + cat + "" + "</u> activity.";
        } else {
            str = 'have ' + compare + ' ' + v + " <u>" + cat + "" + "</u> activities.";
        }
    }
    return str;
}

function displayConstraints() {
    $('#missionwishes').html("");
    for (var i = 0; i < constraints.length; i++) {
        var str = '- ' + displaySingleConstraint(i);
        // spend [compare] [v] [unit] on ['cat']
        // have [compare] [v] ['cat'] activities.
        $('#missionwishes').append(str + '<br/>');
    }

    if (constraints.length == 0) {
        $('#missionwishes').html("- Plan a fun outing that you'd personally love to go on!");
    }
}

function viewHelp() {
    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewMission').hide();
    $('#signup').hide();
    $('#viewActivity').hide();
    $('#viewHelp').show();


    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    showBox();
}

function viewMission() {
    // display mission details;
    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewHelp').hide();
    $('#viewActivity').hide();
    $('#signup').hide();

    $('#box').css('left', '30%');
    $('#box').css('right', '30%');

    $('#viewMission').show();

    showBox();
}

function include(arr, obj) {
    return (arr.indexOf(obj) != -1);
}

function predicateResponse(response, value, activities, explain) {
    this.response = response;
    this.value = value;
    this.activities = activities;
    this.explain = explain;
}

function generatePredicate(constraintDesc) {
    var cat = constraintDesc.cat;
    var unit = constraintDesc.unit;
    var compare = constraintDesc.compare;
    var v = constraintDesc.value;


    var func = function (x) {
        var total = 0;
        var activities = [];
        for (var i = 0; i < x.length; i++) {
            if (include(x[i].data.categories, cat)) {
                activities.push(x[i].data);
                if (unit == 'hours') {
                    total += (parseInt(x[i].data.duration) / 60);
                } else if (unit == 'activities') {
                    total += 1;
                }
            }
        }
        // now check
        if (compare == 'at most') {
            if (unit == 'hours') {
                return new predicateResponse(total <= v, total, activities, "Too much time on '" + cat + "' in the itinerary");
            } else if (unit == 'activities') {
                return new predicateResponse(total <= v, total, activities, "Have too many '" + cat + "' activities in the itinerary");
            }
        } else if (compare == 'at least') {
            if (unit == 'hours') {
                return new predicateResponse(total >= v, total, activities, "Add more '" + cat + "' to the itinerary");
            } else if (unit == 'activities') {
                return new predicateResponse(total >= v, total, activities, "Add more '" + cat + "' to the itinerary");
            }
        } else if (compare == 'exactly') {
            var explain = "";
            if (unit == 'hours') {
                if (total > v) {
                    explain = "Too much time on '" + cat + "' in the itinerary";
                } else if (total < v) {
                    explain = "Add more '" + cat + "' to the itinerary";
                }
                return new predicateResponse(total == v, total, activities, explain);
            } else if (unit == 'activities') {
                if (total > v) {
                    explain = "Have too many '" + cat + "' activities in the itinerary";
                } else if (total < v) {
                    explain = "Add more '" + cat + "' to the itinerary";
                }
                return new predicateResponse(total == v, total, activities, explain);
            }
        }
    }
    return func;
}

function campuslocation(vlabel, data) {
    this.label = vlabel;
    this.data = data;
}

function updateItineraryDisplay() {
    // update the system generated displays in stream
    updateSysStream();

    for (var i = 0; i < itinerary.length; i++) {
        if (i + 1 != wayhash[itinerary[i]].pos) {
            wayhash[itinerary[i]].pos = i + 1;
            updatePinNumber(wayhash[itinerary[i]].pin, i + 1);
        }
    }

    // get the locations of all itinerary items..
    var coords = [];
    for (var i = 0; i < itinerary.length; i++) {
        coords.push(wayhash[itinerary[i]].ll);
    }

    // give numbers to 'em badges in the stream
    for (var i = 0; i < itinerary.length; i++) {
        $('#ss_' + itinerary[i]).empty();
        $('#ss_' + itinerary[i]).append(i + 1);
    }
    // update the route
    GetRoute([startPin.GetPoints()[0]].concat(coords, [endPin.GetPoints()[0]]));

    var i = 1;
    $('.itposinner').each(function () {
        $(this).html(i);
        i++;
    });

}

// Crowd version stuff
var isOnGoing = false;
var madeChange = false;

function updateSubmit() {
    var good = false;
    if(isOnGoing && madeChange){
        good = true;
	
    }
    if(isOnGoing){
		enableEditting = true;
		$('#submitter').val("Please make ANY HELPFUL EDIT to submit. See instructions for details.");
    }
    if (good) {
	$('input[type=submit]').removeAttr("disabled");
        $('#submitter').val("Submit");

	$('#submitter').submit(function(){
	    if(unsavedChanges){
    		var answer = confirm("Your itinerary changes have not been saved. Submit without saving?");
    		if (answer){
    		    return true;
    		}else{
    		    return false;
    		}
    	    }
    	});
    } else {
    	$('input[type=submit]').attr("disabled", "true")
    }
}

function htmlEncode(value){
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}

// Helpers, of some sort
function getURLParams() {
    var params = {}
    var m = window.location.href.match(/[\\?&]([^=]+)=([^&#]*)/g)
    if (m) {
        for (var i = 0; i < m.length; i++) {
            var a = m[i].match(/.([^=]+)=(.*)/)
            params[unescapeURL(a[1])] = unescapeURL(a[2])
        }
    }
    return params
}

function unescapeURL(s) {
    return decodeURIComponent(s.replace(/\+/g, "%20"))
}

var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();