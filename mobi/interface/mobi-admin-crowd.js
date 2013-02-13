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
var waypointIcon = 'wp.gif'; // pin2.gif
var defaultZoom = 12;
var newactpinMoved = false;
var remainingRoute = [];
var longLegs = [];
var restDrive = null;
var restWalk = null;
var tolerance = 0.00005;


// itinerary/stream variables
var itinerary = null;
var itineraryLocs = [];
var locIndex = 0;
var emptyText = "search or add an idea, or click on one below"; // "search or add an activity or thought";
var userStream = []; //user comments, whichever type
var sysStream = []; //system todo
var newStream = [];


// save variables
var unsavedChanges = false;
var sessionStart = null;
var timeoutin = 20;

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
//var tid = "72f2a275c14c3af09e6c2f2b73f03241";
//var uid = "57187fd22e931d8b2145d920967e559d";
var tid = null;
var uid = null; // TODO: get user id from parameters
var calculatedEnd = null;
var user = null;
var numusers = null;
var creatorName = null;
var assignmentId = null;
var transit = null;

// What actually happens at start
$(document).ready(function (jQuery) {

    sessionStart = (new Date()).getTime();

    readyAdd();

    jQuery("#availableResourcesSpace").hide();

    jQuery("#itinerary").sortable({
        //items: "tr:not(.ends)", 
        scroll: true,
        start: function (e, ui) {
            $('#' + ui.item.attr('id')).unbind('click');
        },
        stop: function (e, ui) {
            setTimeout(function () {
                $('#' + ui.item.attr('id')).click(function () {
                    //			alert("calling from sortable stop");
                    viewActivity(getItem(ui.item.attr('id')));
                });
            }, 300);
        },
        update: function (event, ui) {
            itinerary = $("#itinerary").sortable('toArray');
            //	     enableItSave();
            saveItinerary();
            updateItineraryDisplay();
        },
        //helper: fixHelper});
    });
    jQuery("#sortable").disableSelection();

    //readUrlParameters(); // get userId and taskId
    loadTaskState(); // Load where we are current at with task

    loadUserData();
    initMap();


    loadStream(); // load all the stream info
    loadStateIntoInterface(); // now load it all into interface.
    disableItSave();

    $('#box').css('left', '15%');
    $('#box').css('right', '15%');


    GetNewActMap();
    readySearchBox();


    if (user == null) {
        //	$("#thanksloc").html(" to " + eventName.substring(9));
        //	showSignup();
        //	alert("User isn't recognized");
    }



    $(window).resize(function () {
        /// HACK TO FIX MAP RESIZE PROBLEMS
        if (map != null) {
            map.Resize();
        }
        if (newactmap != null) {
            //    newactmap.Resize();
        }
        delay(function () {
            if (map != null) {
                map.SetCenter(map.GetCenter());
            }
            if (newactmap != null) {
                //		newactmap.SetCenter(newactmap.GetCenter());
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
    
    initializeCalendar();
});

// Called first in document ready to hide popup box
function readyAdd() {
    $('#boxclose').click(function () {
        closeAdd();
    });
}

// Hides popup box and everything inside
function closeAdd() {
    $('#searchBox').val(emptyText);
    $('#searchBox').css('color', 'gray');
    newactpinMoved = false;
    $('#box').css('top', '-700px');
    $('#overlay').css('display', 'none');
    $('#viewMission').css('display', 'none');
    $('#editMission').css('display', 'none');
    $('#viewHelp').css('display', 'none');
    $('#signup').css('display', 'none');
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
}

// Called second in document ready to get user id and task id
// Shows Mobi interface
function readUrlParameters() {
    var params = getURLParams();
    if (params.tid) {
        tid = params.tid;
    }

    if (params.uid) {
        uid = params.uid;
    }

    jQuery('#mobi-content').css('display', 'inline');
    return;
}

// Async ajax call. Loads the task state into the code based on task id
// Loads requester data as well
function loadTaskState() {
    jQuery.ajax({
        type: "GET",
        // dataType: "json", 
        url: "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/loadTurkTourTaskState.php",
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



    //    if(data.transit == 1){
    // can use transit
    transit = true;
    //  }
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
    newactmap = new VEMap('addmapDiv');

    var mapOptions = new VEMapOptions();
    mapOptions.DashboardColor = 'black';
    newactmap.SetDashboardSize(VEDashboardSize.Tiny);
    newactmap.HideScalebar();

    mapOptions.UseEnhancedRoadStyle = true;
    //newactmap.SetCredentials("AmoK7LJck9Ce_JO_n_NAiDlRv88YZROwdvPzWdLi57iP3XQeGon28HJVdnHsUSkp");
    newactmap.LoadMap(mapCenter, 10, 'r', false, VEMapMode.Mode2D, true, 0, mapOptions);
    newactmap.SetZoomLevel(defaultZoom);
    // Layer for find
    actfindLayer = new VEShapeLayer();
    actfindLayer.SetTitle("findLayer");
    newactmap.AddShapeLayer(actfindLayer);

    newactPin = AddPushpin(newactmap, null, 'new activity', '', true, "pin-end.png");
    newactPin.SetZIndex(2000);
    newactPin.onenddrag = OnTop('#addactloc');

    viewactPin = AddPushpin(newactmap, null, '', '', false, "pin2.gif");
    viewactPin.Hide();

    // try changing css.
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
                e.Shape.SetCustomIcon('pin-start.png');
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
            driveStr = "http://dev.virtualearth.net/REST/v1/Routes/Transit?timeType=Departure&dateTime=3:00:00PM&" + str + "&routePathOutput=Points&output=json&distanceUnit=mi&key=" + credentials + "&jsonp=?";
        } else {
            // do driving path
            driveStr = "http://dev.virtualearth.net/REST/v1/Routes/Driving?" + str + "&routePathOutput=Points&output=json&distanceUnit=mi&key=" + credentials + "&jsonp=?";
        }
        var walkStr = "http://dev.virtualearth.net/REST/v1/Routes/Walking?" + str + "&routePathOutput=Points&output=json&distanceUnit=mi&key=" + credentials + "&jsonp=?";

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
        //	alert(walkTime);
        //	alert(driveTime);
        if (!driveOnly && (walkOnly || driveTime > walkTime || walkTime < 15 * 60)) {
            mode.push('walk');
            legTimes.push(walkTime);
            routeline = restWalk[i].resourceSets[0].resources[0].routePath.line;
            // alert("walking part " + i);
        } else {
            mode.push('drive');
            legTimes.push(driveTime);
            routeline = restDrive[i].resourceSets[0].resources[0].routePath.line;
            //  alert("driving part " + i);
        }

        var routepoints = new Array();
        for (var j = 0; j < routeline.coordinates.length; j++) {
            routepoints[j] = new VELatLong(routeline.coordinates[j][0], routeline.coordinates[j][1]);
        }
        // Draw the route on the map
        var shape = new VEShape(VEShapeType.Polyline, routepoints);

        //	shape.SetLineColor(new VEColor(3, 209, 92, 1));
        //	shape.SetLineColor(new VEColor(40, 209,40, 1));
        //	if(mode[i] == 'drive'){
        shape.SetLineColor(new VEColor(3, 209, 92, 1));
        shape.SetLineWidth(3);

        //	    shape.SetLineColor(new VEColor(0,200,0,1));
        //	}else{
        //	    shape.SetLineColor(new VEColor(200,0,0,1));
        //	}
        //	shape.SetLineWidth(2);
        //	shape.SetLineWidth(2);

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
        //	$('#totaltriptime').html("<font color='red'>" + readMinutes(actualend - beginTime) + '</font>');
    } else {
        $('.endtime').last().html('(' + minToTime(actualend) + ')');

    }
    $('#totaltriptime').html(readMinutes(actualend - beginTime));

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

    //      map.SetCredentials("AmoK7LJck9Ce_JO_n_NAiDlRv88YZROwdvPzWdLi57iP3XQeGon28HJVdnHsUSkp");
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
        //	var options = new VESearchOptions;
        //	options.ShapeLayer = actfindLayer;
        //	newactmap.Search(txt, processFind, options);
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
        //	var options = new VESearchOptions;
        //	options.ShapeLayer = actfindLayer;
        //	newactmap.Search(txt, processFind, options);
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
        //	var options = new VESearchOptions;
        //	options.ShapeLayer = actfindLayer;
        //	newactmap.Search(txt, processFind, options);
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
    shape.SetTitle(si.data.name);
    shape.SetDescription("<font color='black'>" + si.data.description + "</font><br/>@" + si.data.location.name);
    //	      var str = "<div style='position: relative; background: url(" + custom + "); width:25px;height:29px'><div style='position: absolute; bottom: 0.5em; left: 0.5em; font-weight: bold; color: #fff;'>" + pos + '</div></div>'
    //	      var str2 = "<img src='" + custom + "'/><div style='color:#ffffff;position:absolute;left:5px; top:0px'>" + pos  + "</div>";
    //    var str3 = "<table width='30px' height='32px'><tr><td style='background: url(" + custom + ") no-repeat; vertical-align: top; text-align: center'><span style='font-weight: bold; color: #fff;'>" + pos + "</span></td></tr></table>";
    shape.SetCustomIcon(waypointIcon);
    shape.SetZIndex(1001);
    shape.Draggable = false;
    waylayer.AddShape(shape);
    wayhash[si.id] = new waypointPin(shape, ll, null, parseInt(si.data.duration));

}

function processFind(a, b, c, d, e) {

    if (b != null && b.length >= 1) {
        var shape;
        var numResults = a.GetShapeCount();
        //alert("num shapes: " + numResults);
        for (var i = 0; i < a.GetShapeCount(); i++) {
            shape = a.GetShapeByIndex(i);
            //    alert(shape.GetTitle());
            shape.SetCustomIcon("wp.gif");
            shape.SetDescription(shape.GetDescription() + "<br/><br/><a href='#' onclick='moveact(" + i + ")' style='color:#0000CE'>Move location pin here</a>");
            // shape.SetZIndex(1000, 1000);
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
    e.SetCustomIcon('pin-start.png');
    newactmap.SetCenter(shape.GetPoints()[0]);
    $(ontopname).val(shape.GetTitle());
}

function initMap() {
    GetMap();
    var startll = new VELatLong(start.lat, start.long);
    var endll = new VELatLong(end.lat, end.long);

    startPin = AddPushpin(map, startll, 'Start location', start.name, false, "pin-start.png");

    if (computeDistance(startll, endll) < tolerance) {
        var dx = toler(tolerance) * randSign();
        var dy = toler(tolerance) * randSign();
        endll = new VELatLong(parseFloat(end.lat) + dx, parseFloat(end.long) + dy);
    }
    endPin = AddPushpin(map, endll, 'End location', end.name, false, "pin-end.png");


    // GetMap();
    // startPin = AddPushpin(map, new VELatLong(start.lat, start.long), 'Start location', start.name, false, "pin-start.png");
    // endPin = AddPushpin(map, new VELatLong(end.lat, end.long), 'End location', end.name, false, "pin-end.png");    

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
    this.data.start = beginTime; // for calendar
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
    newactmap.SetZoomLevel(defaultZoom);
    newactmap.SetCenter(mapCenter);

    viewactPin.Hide();
    newactPin.SetPoints([mapCenter]);
    newactPin.SetTitle('new activity');
    newactPin.SetDescription('');
    newactPin.SetCustomIcon("pin-end.png");
    newactPin.onenddrag = OnTop('#addactloc');
    newactPin.Show();


    $('#addActivity').css('display', 'block');
    $('#addNote').css('display', 'none');
    $('#viewNote').css('display', 'none');
    $('#viewActivity').css('display', 'none');


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


    // location, autocomplete
    // if(locationAutocomplete == null){
    // locationAutocomplete = $("input#addactloc").autocomplete({
    // 	minLength: 2,
    // 	source: campuslocations,
    // 	select: function( event, ui ) {
    // 	    donearby = false;
    // 	    actfindLayer.DeleteAllShapes();
    // 	    var loc = ui.item;
    // 	    $('#addactloc').val(loc.data.name);
    // 	    var latlong = new VELatLong(loc.data.lat, loc.data.lng);
    // 	    newactPin.SetPoints([latlong]);
    // 	    newactPin.SetTitle(loc.data.name);
    // 	    newactPin.SetCustomIcon('pin-start.png');
    // 	    newactmap.SetCenter(latlong);
    // 	    newactpinMoved = true;
    // 	    return false;
    // 	}

    // });
    // }

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


    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });

}

function viewNote(si) {

    $('#box').css('left', '30%');
    $('#box').css('right', '30%');

    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').show();
    $('#viewActivity').hide();


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
    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });
}

function viewActivity(si) {
    //    alert(si.id);
    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    $('#addActivity').css('display', 'none');
    $('#addNote').css('display', 'none');
    $('#viewNote').css('display', 'none');
    $('#viewActivity').css('display', 'block');

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

            // var answer = confirm("Remove activity from itinerary?")
            // if (answer){
            // }
            // else{
            // 	return;
            // }

            // remove it
            $('#' + si.id).remove();

            // remove it from itinerary
            itinerary = $("#itinerary").sortable('toArray');

            // remove shape
            waylayer.DeleteShape(wayhash[si.id].pin);
            // remove it from waypoint hash
            delete(wayhash[si.id]);
            
            removeItemFromId(si.id); // for calendar

            // get rid of the itinerary badge
            $('#ss_' + si.id).remove();

            // update display
            updateItineraryDisplay();

            //enableItSave();
            saveItinerary();

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

    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });

}

function setTimeField(name, time, s, e) {
    for (var i = s; i < e; i++) {
        for (var j = 0; j <= 45; j += 30) {
            var o = $(document.createElement('option'));
            o.val(i * 60 + j);
            if (time == i * 60 + j) {
                o.attr('selected', 'selected');
            }
            var is = i;
            var js = j;

            if (j == 0) js = '00';
            if (i < 12) {
                o.text(is + ":" + js + " AM");
            } else if (i >= 24) {
                o.text(is % 24 + ":" + js + " AM (+1)");
            } else {
                if (i == 12) {
                    o.text(is + ":" + js + " PM");
                } else {
                    o.text((is - 12) + ":" + js + " PM");
                }
            }

            $(name).append(o);
        }
    }
}

function editStart() {
    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewActivity').hide();
    $('#editActivity').hide();
    $('#editEnd').hide();
    $('#editStart').show();

    $('#addActivity').show();
    $('#addmapDiv').show().parentsUntil('#addActivity').andSelf().siblings().hide();


    actfindLayer.DeleteAllShapes();
    // hide theirs, show mine
    viewactPin.Hide();

    var ll = new VELatLong(start.lat, start.long);
    newactPin.SetPoints([ll]);
    newactPin.SetTitle("Start location");
    newactPin.SetDescription(start.name);
    newactPin.SetCustomIcon("pin-end.png");
    newactPin.onenddrag = OnTop('#editstartloc');
    newactPin.Show();
    newactmap.SetCenter(ll);


    $('#saveeditstartbutton').unbind();
    $('#saveeditstartbutton').click(function () {
        if (start.name != $('#editstartloc').val()) {
            start.name = 'arrive at ' + $('#editstartloc').val();
            $('.itname').first().html(start.name);
        }

        start.name = $('#editstartloc').val();
        start.lat = newactPin.GetPoints()[0].Latitude;
        start.long = newactPin.GetPoints()[0].Longitude;


        if (beginTime != $('#editstarttime').val()) {

            beginTime = parseInt($('#editstarttime').val());
            $('.endtime').first().html('(' + minToTime(beginTime) + ')');
        }

        startPin.SetPoints(new VELatLong(0.00005 + start.lat, 0.00005 + start.long));
        startPin.SetDescription($('#editstartloc').val());
        saveEditEnds();
        updateItineraryDisplay();
    });

    $('#editstartloc').val(start.name);

    setTimeField('#editstarttime', beginTime, 6, 24);

    // location, autocomplete
    //    if(editlocationAutocomplete == null){
    // editlocationAutocomplete = $("input#editstartloc").autocomplete({
    //     minLength: 3,
    //     source: getLocations(),
    //     select: function( event, ui ) {
    // 	donearby = false;
    // 	actfindLayer.DeleteAllShapes();
    // 	var loc = ui.item;
    // 	$('#editstartloc').val(loc.data.location.name);
    // 	var latlong = new VELatLong(loc.data.location.lat, loc.data.location.long);
    // 	newactPin.SetPoints([latlong]);
    // 	newactPin.SetDescription(loc.data.location.name);
    // 	newactPin.SetCustomIcon('pin-start.png');
    // 	newactmap.SetCenter(latlong);
    // 	newactpinMoved = true;
    // 	return false;
    //     }

    // });
    //  }

    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });
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

function editEnd() {
    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewActivity').hide();
    $('#editActivity').hide();
    $('#editStart').hide();
    $('#editEnd').show();
    $('#addActivity').show();
    $('#addmapDiv').show().parentsUntil('#addActivity').andSelf().siblings().hide();


    actfindLayer.DeleteAllShapes();
    // hide theirs, show mine
    viewactPin.Hide();

    var ll = new VELatLong(end.lat, end.long);
    newactPin.SetPoints([ll]);
    newactPin.SetTitle("End location");
    newactPin.SetDescription(end.name);
    newactPin.SetCustomIcon("pin-end.png");
    newactPin.onenddrag = OnTop('#editendloc');
    newactPin.Show();
    newactmap.SetCenter(ll);


    $('#saveeditendbutton').unbind();
    $('#saveeditendbutton').click(function () {
        if (end.name != $('#editendloc').val()) {
            end.name = 'arrive at ' + $('#editendloc').val();
            $('.itname').last().html(end.name);
        }
        end.name = $('#editendloc').val();
        end.lat = newactPin.GetPoints()[0].Latitude;
        end.long = newactPin.GetPoints()[0].Longitude;


        if (endTime != $('#editendtime').val()) {
            endTime = parseInt($('#editendtime').val());
            $('.endtime').last().html('(' + minToTime(endTime) + ')');
        }

        endPin.SetPoints(new VELatLong(0.00005 + end.lat, 0.00005 + end.long));
        endPin.SetDescription($('#editendloc').val());
        saveEditEnds();
        updateItineraryDisplay();
    });

    $('#editendloc').val(end.name);

    setTimeField('#editendtime', endTime, 6, 30);

    // location, autocomplete
    //    if(editlocationAutocomplete == null){
    editlocationAutocomplete = $("input#editendloc").autocomplete({
        minLength: 3,
        source: getLocations(),
        select: function (event, ui) {
            donearby = false;
            actfindLayer.DeleteAllShapes();
            var loc = ui.item;
            $('#editendloc').val(loc.data.location.name);
            var latlong = new VELatLong(loc.data.location.lat, loc.data.location.long);
            newactPin.SetPoints([latlong]);
            newactPin.SetDescription(loc.data.location.name);
            newactPin.SetCustomIcon('pin-start.png');
            newactmap.SetCenter(latlong);
            newactpinMoved = true;
            return false;
        }

    });
    //  }

    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
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
                tag = "<span style='white-space:no-wrap;'><a class='tagrowitem' href='#' onclick=" + "\"filterOnTag('" + categories[i] + "')\">" + '#' + printCat(categories[i]) + "</a></span>";
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
    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });

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
    var c = "<input type=\"text\" name=\"" + name + "\" value=\"" + val + "\" onkeyup=\"refreshOptions(this)\" size=\"" + size + "\"/>&nbsp; <img src='exit.png' width='11' style='vertical-align:middle;margin-right:20px' onclick='removeField(this)'>";

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
    $(fname).append("&nbsp; <img src='exit.png' width='11' style='vertical-align:middle;margin-right:20px' onclick='removeRequirement(this)'>");
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

    $('#editActivity').show();

    $('#addActivity').show();
    $('#addmapDiv').show().parentsUntil('#addActivity').andSelf().siblings().hide();

    actfindLayer.DeleteAllShapes();
    // hide theirs, show mine
    viewactPin.Hide();

    var ll = new VELatLong(si.data.location.lat, si.data.location.long);
    newactPin.SetPoints([ll]);
    newactPin.SetTitle(si.data.name);
    newactPin.SetDescription(si.data.description);
    newactPin.SetCustomIcon("pin-end.png");
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
                newactPin.SetCustomIcon('pin-start.png');
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



    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });
}

function editNote(si) {
    $('#box').css('left', '30%');
    $('#box').css('right', '30%');

    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewActivity').hide();

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


    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });
}

function addActivityToItinerary(si) {
    // add the waypoint
    AddWaypointPin(si);
    // update itinerary ordering in actual data
    itinerary.unshift(si.id);
    // update sortable
    displayItineraryItem('#itinerary', si.id, true, 1, si.data.name, si.data.location.name, '' + si.data.duration + ' min + travel', true);

    // update stream to say it's in itinerary

    $('#stime_' + si.id).append(createInItineraryButton(si));

    // enable the save button
    //    enableItSave();
    saveItinerary();

    updateItineraryDisplay();

    addNewItemFromId(si.id); // for calendar
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

    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });
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

    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });
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
    newStream.unshift(si);

    var item = createStreamItem(si);
    $('#userStreamBody').prepend(item);
    //    item.insertAfter($('#brainstream tbody tr').last());

    closeAdd();
}

function checkTimeOut() {
    var timeNow = (new Date()).getTime();
    var secondsDiff = (timeNow - sessionStart) / 1000;
    if (secondsDiff > timeoutin * 60) {
        alert("You have been logged in for over " + timeoutin + " minutes. To avoid conflicts with others' edits, please refresh the page before continuing. We apologize for the inconvenience");
        return true;
    } else {
        return false;
    }
}

function saveEditActivity(oldsi) {
    var oldid = oldsi.id;
    if (checkTimeOut()) {
        closeAdd();
        return;
    }


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
    newStream.unshift(si);

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
    si.data.start = beginTime; // for calendar

    // add it to local stream
    userStream.unshift(si);
    searchAutocomplete.autocomplete("option", "source", userStream);
    newStream.unshift(si);

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
    // var str = "<table width='25px' height='26px'><tr><td style='background: url(" +  waypointIcon + ") no-repeat; vertical-align: top; text-align: center'><span style='font-weight: bold; color: #fff'>" + pos + "</span></td></tr></table>";

    var str = "<table><tr><td><div class='pinpos'>" + pos + "</div></td></tr></table>";
    pin.SetCustomIcon(str);
}

// save stream item on server, and then return its id
function submitEntry(si) {
    var ret = null;
    jQuery.ajax({
        type: "POST",
        url: "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/submitTurkTourEntry.php",
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
    //    alert('first end');
    return ret;

}

// save stream item on server, and then return its id
function submitEdit(si, oldid) {
    //    alert('second start');

    oldid = parseInt(oldid.substring(5));

    var ret = null;
    jQuery.ajax({
        type: "POST",
        url: "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/submitTurkTourEdit.php",
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

function displayTime(ms) {

    //// trying pretty date
    var d = new Date(ms);
    //    return humane_date(d);

    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // convert from ms since 1970

    var ampm = 'AM';
    var hours = d.getHours()
    var minutes = d.getMinutes()
    var dayofweek = weekday[d.getDay()];

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (hours > 11) {
        ampm = 'PM';
    }
    if (hours > 12) {
        hours -= 12;
    }
    return dayofweek + ",<br/>" + hours + ":" + minutes + " " + ampm;
}

function printCat(cat) {
    if (cat == 'sights/attractions') {
        return 'sights';
    }
    if (cat == 'concerts/shows') {
        return 'concerts and shows';
    }
    if (cat == 'food/drink') {
        return 'food or drink';
    }
    return cat;
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
    // for(var i = 0; i < si.data.categories.length; i++){
    // 	descntag.append("<a class='tagstreamitem' href='#' onclick=" + "\"filterOnTag('" + si.data.categories[i] + "')\">" + '#' + printCat(si.data.categories[i]) + "</a>");
    // }

    for (var i = 0; i < si.data.categories.length; i++) {
        descntag.append("<span style='float:left;white-space:no-wrap;'><a class='tagstreamitem' href='#' onclick=" + "\"filterOnTag('" + si.data.categories[i] + "')\">" + '#' + si.data.categories[i] + "</a></span>");
    }
    // if(si.type != 'todo'){
    //	var idea = '';
    //	if(si.edited != undefined && si.edited[0] != "undefined"){

    //	    idea = "Idea from " + firstName(userKeys[si.edited[0]]) + ".";

    //	}
    //	descntag.append("<div style='clear:both;font-size:85%'>" + idea + "</div>");
    //+ displayTime(si.createTime) + 
    //  }	

    msg.append(descntag);

    var time = $(document.createElement('td'));
    time.css('width', '0%');
    time.attr('id', 'stime_' + si.id);
    var tt = $(document.createElement('div'));
    tt.addClass('badge_' + si.type);
    time.append(tt);
    //   time.append(displayTime(si.createTime));

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
    //    alert(wayhash[si.id]);
    if (wayhash[si.id] != undefined) {
        sp.append(wayhash[si.id].pos);
    }
    //    sp.append("<br/><button style='border:none;color:white;background:gray'>in itinerary</b>");
    return sp;
}

/// opens up the time for viewing, or additional editting...
function openItem(item) {
    //    var item = getItem(id);

    if (item.type == 'note' || item.type == 'todo') {
        viewNote(item);
    } else if (item.type == 'activity') {
        viewActivity(item);
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

function displayItineraryItem(name, id, move, pos, title, loc, time, isnew) {
    var item = createItineraryItem(id, move, pos, title, loc, time, isnew);
    $(name).prepend(item);
}

function createItineraryItem(id, move, pos, title, loc, time, isnew) {

    var w1 = '2%';
    var w2 = '60%';
    var w3 = '38%';
    //    var w4 = '10%';

    var item = $(document.createElement('tr'));

    var itemPos = $(document.createElement('td'));
    itemPos.css('width', w1);
    //    itemPos.css('float', 'left');
    //    itemPos.css('text-align', 'center');
    if (move) {
        itemPos.addClass('itpos');
    } else {
        itemPos.addClass('endpos');
    }

    var itemPosInner = $(document.createElement('div'));
    if (move) {
        itemPosInner.addClass('itposinner');
        itemPosInner.append(pos);
    } else {
        if (pos == 'start') {
            itemPosInner.addClass('startposinner');
        } else {
            itemPosInner.addClass('endposinner');
        }
    }


    itemPos.append(itemPosInner);

    var itemName = $(document.createElement('td'));
    itemName.css('width', w2);
    itemName.addClass('itname');
    itemName.append(title);
    if (isnew) {
        itemName.append("<font color='red'> (new!)</font>");
    }

    var itemTime = $(document.createElement('td'));
    itemTime.css('width', w3);
    itemTime.append('(' + time + ')');
    if (move) {
        itemTime.addClass('ittime');
    } else {
        itemTime.addClass('endtime');
    }

    // var itemRemove = $(document.createElement('td'));
    // itemRemove.css('width', w4);
    // itemRemove.css('cursor', 'default');
    // itemRemove.addClass('itremove');

    // if(move){
    // 	itemRemove.append("<img src='exit.png' onclick='removeItem(this)'/>");
    // }

    item.append(itemPos);
    item.append(itemName);
    item.append(itemTime);
    //    item.append(itemRemove);

    if (!move) {
        $(item).addClass('ends');
        $(item).css('cursor', 'default');
        $(item).hover(function () {
            $(this).css('background', '#FFAB07');
            $(this).find('.itremove').css('background', 'white');
        }, function () {
            $(this).css('background', 'white');
        });

    } else {
        $(item).css('cursor', 'move');

        $(item).hover(function () {
            $(this).css('background', '#FFAB07');
            $(this).find('.itremove').css('background', 'white');
        }, function () {
            $(this).css('background', 'white');
        });
    }

    $(item).attr('id', id);
    $(item).addClass('itineraryitem')
    $(item).unbind('click');
    if (move) {
        $(item).click(function () {
            viewActivity(getItem(id));
        });
    } else {
        $(item).click(function () {
            if (id == 'admin_start') {
                editStart();
            } else {
                editEnd();
            }
        });
    }



    return item;
}

function removeItem(e) {
    // var answer = confirm("Remove activity from itinerary?")
    // if (answer){
    // }
    // else{
    // 	return;
    // }


    var tr = $(e).closest('tr');
    var id = tr.attr('id');
    // remove it from sortable
    tr.remove();

    // remove it from itinerary
    itinerary = $("#itinerary").sortable('toArray');

    // remove shape
    waylayer.DeleteShape(wayhash[id].pin);
    // remove it from waypoint hash
    delete(wayhash[id]);

    // get rid of the itinerary badge
    $('#ss_' + id).remove();

    // update display
    updateItineraryDisplay();

    //    enableItSave();
    saveItinerary();
}

function loadStream() {
    jQuery.ajax({
        type: "GET",
        dataType: "json",
        url: "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/loadTurkTourStream.php",
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
    //    if(uid == null) return;


    jQuery.ajax({
        type: "GET",
        // dataType: "json", 
        url: "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/loadTurkAdminUserInfo.php",
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

function showRequestPage() {
    jQuery('#planningWorkspace').hide();
    jQuery('#availableResourcesSpace').show();
}

function goBack() {
    jQuery('#planningWorkspace').show();
    jQuery('#availableResourcesSpace').hide();
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

    jQuery('#stateDisplay').empty();
    jQuery('#availableResources').empty();
    jQuery('#sortable tbody').empty();

    // load start and end location
    displayItineraryItem('#itineraryStart', 'admin_start', false, 'start', 'arrive at ' + start.name, start, minToTime(beginTime), false);
    displayItineraryItem('#itineraryEnd', 'admin_end', false, 'end', 'arrive at ' + end.name, end, minToTime(beginTime), false);


    // set up itinerary
    itinerary = state.itinerary;
    //itinerary = [];
    // 
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

        // update sortable
        displayItineraryItem('#itinerary', si.id, true, 1, si.data.name, si.data.location.name, '' + si.data.duration + ' min + travel', false);

        // update stream to say it's in itinerary
        //	$('#stime_' + si.id).append(createInItineraryButton(si));
    }
    updateItineraryDisplay();

    ///////// TAGS////////////
    var tag;

    // do tag row
    for (var i = 0; i < categories.length; i++) {
        tag = "<span style='white-space:no-wrap;'><a class='tagrowitem' href='#' onclick=" + "\"filterOnTag('" + categories[i] + "')\">" + '#' + printCat(categories[i]) + "</a></span>";
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

function saveEditEnds() {

    var ret = true;
    jQuery.ajax({
        type: "POST",
        url: "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/submitSubjectTourEnds.php",
        async: false,
        data: ({
            userId: uid,
            start: JSON.stringify(start),
            beginTime: beginTime,
            end: JSON.stringify(end),
            endTime: endTime,
            taskId: tid,
            startState: stateId,
            type: "tour"
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

    closeAdd();
    return ret;
}

function saveEditMission() {

    var ret = true;
    jQuery.ajax({
        type: "POST",
        url: "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/submitSubjectMission.php",
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
                disableItSave();
            }
        }
    });

    closeAdd();
    return ret;
}

function saveItinerary() {

    //    state.admin.constraints[1].value = 1;
    // in backend, check to make sure itinerary is legal and consistent
    state.itinerary = itinerary;

    var ret = true;

    jQuery.ajax({
        type: "POST",
        url: "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/submitTurkTourItinerary.php",
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

function printItinerary() {
    var str = "";
    var itineraryItems = [];
    for (var i = 0; i < itinerary.length; i++) {
        var si = getItem(itinerary[i]);
        itineraryItems.push(si);
    }

    for (var i = 0; i < itineraryItems.length; i++) {
        str += "<div>" + (i + 1) + ". " + itineraryItems[i].data.name + "<div/><div style='margin-left:20px'>Place: " + itineraryItems[i].data.location.name + "</div><div style='margin-left:20px'>" + itineraryItems[i].data.description + "</div>"
    }
    return str;
}

function saveSnapshot() {

    //    state.admin.constraints[1].value = 1;
    // in backend, check to make sure itinerary is legal and consistent
    var ret = true;

    jQuery.ajax({
        type: "POST",
        url: "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/submitTurkTourSnapshot.php",
        async: false,
        data: ({
            userId: uid,
            answer: JSON.stringify(state),
            taskId: tid,
            itinerary: printItinerary(),
            requestername: user.name,
            requesteremail: user.email,
            startState: stateId,
            type: "turktour"
        }),
        success: function (msg) {

            if (msg == "") {

                // cannot save it
                alert("It appears that someone else has recently made a change to the itinerary that you are trying to take a snapshot of. Please refresh the page before continuing. We apologize for the inconvenience");
                ret = false;
                return;
            } else {
                alert("We have saved a snapshot of the current itinerary, and sent you a copy via email.");
                //		alert(JSON.stringify(user));
                disableItSave();
            }
        }
    });
    return ret;
}

function disableItSave() {

    unsavedChanges = false;
    $('#saveitbutton').disabled = 'true';

    $('#saveitbutton').text('drag activities to reorder, click to edit');
    $('#saveitbutton').css('background', '#d3f1f2');
    $('#saveitbutton').css('color', '#0000CE');
    $('#saveitbutton').css('border', '1px solid #d3f1f2');
    $('#saveitbutton').unbind();
}

function enableItSave() {

    if (!unsavedChanges) {
        unsavedChanges = true;
        $('#saveitbutton').disabled = 'false';
        $('#saveitbutton').text('save itinerary changes!');
        $('#saveitbutton').css('background', '#0000CE');
        $('#saveitbutton').css('color', 'white');
        $('#saveitbutton').css('border', '1px outset black');
        $('#saveitbutton').unbind();
        $('#saveitbutton').click(function () {
            if (checkTimeOut()) {
                return;
            }
            var saved = saveItinerary();
            if (saved) {
                alert("Changes to the itinerary have been saved.");
            }
        });
    }

}

function shortName(sn) {
    if (sn == username) {
        return "you";
    }
    sn = sn;
    sn = sn.split(' ');
    return sn[0]; // + " " + sn[sn.length-1][0] + ".";
}

function firstName(sn) {

    sn = sn;
    sn = sn.split(' ');
    return sn[0]; // + " " + sn[sn.length-1][0] + ".";
}

function updateScheduleConstraints(actualend) {
    var si;
    var freetime = endTime - actualend;
    var allowedEmpty = .05 * (endTime - beginTime);
    //    alert(actualend);
    //    alert(freetime);
    //    alert(endTime);
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
    displayStreamItem('#sysStreamBody', si);

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


    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });
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



    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });

}

function sendLink() {
    var signupname = rtrim(jQuery('#signupName').val());
    var signupemail = rtrim(jQuery('#signupEmail').val());

    jQuery.ajax({
        type: "POST",
        url: "http://people.csail.mit.edu/hqz/Crowdcierge/mobi/sendSubjectFriendLink.php",
        async: false,
        data: ({
            name: signupname,
            email: signupemail,
            requestername: creatorName,
            location: eventName.substring(9),
            taskId: tid,
            type: "tour"
        }),
        success: function (obj) {
            uid = obj;
            //	    alert(obj);
        }
    });

    return;

}

function signmeup() {
    if (rtrim(jQuery('#signupName').val()) == "") {
        alert("Please enter your name.");
        return;
    }
    // check if there is a name and an email
    var filter = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (filter.test(rtrim(jQuery('#signupEmail').val()))) {
        // send email to person saying they can come back to help...
        // should have loaded the requester's name by now
        sendLink();
        // now that we got an id ourselves, just load users
        loadUserData();
        $('#boxclose').show();
        closeAdd();
    } else {
        alert("Please enter a valid email address.");
    }
    return;
    // store than userid and/or names for the current session

    // see how names are handled in outings and implement something similar
    // check to make sure edits on name are handled ok.
}

function showSignup() {

    $('#boxclose').hide();
    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewHelp').hide();
    $('#viewActivity').hide();
    $('#viewMission').hide();
    $('#signup').show();

    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });

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

function displayNeedLink() {
    jQuery("#needLink").css('display', 'block');
}

function campuslocation(vlabel, data) {
    this.label = vlabel;
    this.data = data;
}

var fixHelper = function (e, ui) {
    ui.children().each(function () {
        $(this).width($(this).width());
    });
    return ui;
};

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


// Things I don't understand
function g(a){var b=typeof a;if(b=="object")if(a){if(a instanceof Array||!(a instanceof Object)&&Object.prototype.toString.call(a)=="[object Array]"||typeof a.length=="number"&&typeof a.splice!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("splice"))return"array";if(!(a instanceof Object)&&(Object.prototype.toString.call(a)=="[object Function]"||typeof a.call!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("call")))return"function"}else return"null";
else if(b=="function"&&typeof a.call=="undefined")return"object";return b};function h(a){a=String(a);var b;b=/^\s*$/.test(a)?false:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,""));if(b)try{return eval("("+a+")")}catch(c){}throw Error("Invalid JSON string: "+a);}function i(a){var b=[];j(new k,a,b);return b.join("")}function k(){}
function j(a,b,c){switch(typeof b){case "string":l(a,b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(b==null){c.push("null");break}if(g(b)=="array"){var f=b.length;c.push("[");for(var d="",e=0;e<f;e++){c.push(d);j(a,b[e],c);d=","}c.push("]");break}c.push("{");f="";for(d in b)if(b.hasOwnProperty(d)){e=b[d];if(typeof e!="function"){c.push(f);l(a,d,c);c.push(":");j(a,e,c);f=","}}c.push("}");break;
case "function":break;default:throw Error("Unknown type: "+typeof b);}}var m={'"':'\\"',"\\":"\\\\","/":"\\/","\u0008":"\\b","\u000c":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\u000b":"\\u000b"},n=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;function l(a,b,c){c.push('"',b.replace(n,function(f){if(f in m)return m[f];var d=f.charCodeAt(0),e="\\u";if(d<16)e+="000";else if(d<256)e+="00";else if(d<4096)e+="0";return m[f]=e+d.toString(16)}),'"')};window.JSON||(window.JSON={});if(typeof window.JSON.serialize!=="function")window.JSON.serialize=i;if(typeof window.JSON.parse!=="function")window.JSON.parse=h;

if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (var i = (start || 0); i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisp*/ ) {
        var len = this.length;
        if (typeof fun != "function") throw new TypeError();

        var res = new Array();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this)) res.push(val);
            }
        }

        return res;
    };
}

if (!Array.prototype.map) {
    Array.prototype.map = function (fun /*, thisp*/ ) {
        var len = this.length;
        if (typeof fun != "function") throw new TypeError();

        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) res[i] = fun.call(thisp, this[i], i, this);
        }
        return res;
    };
}