function g(a){var b=typeof a;if(b=="object")if(a){if(a instanceof Array||!(a instanceof Object)&&Object.prototype.toString.call(a)=="[object Array]"||typeof a.length=="number"&&typeof a.splice!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("splice"))return"array";if(!(a instanceof Object)&&(Object.prototype.toString.call(a)=="[object Function]"||typeof a.call!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("call")))return"function"}else return"null";
else if(b=="function"&&typeof a.call=="undefined")return"object";return b};function h(a){a=String(a);var b;b=/^\s*$/.test(a)?false:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,""));if(b)try{return eval("("+a+")")}catch(c){}throw Error("Invalid JSON string: "+a);}function i(a){var b=[];j(new k,a,b);return b.join("")}function k(){}
function j(a,b,c){switch(typeof b){case "string":l(a,b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(b==null){c.push("null");break}if(g(b)=="array"){var f=b.length;c.push("[");for(var d="",e=0;e<f;e++){c.push(d);j(a,b[e],c);d=","}c.push("]");break}c.push("{");f="";for(d in b)if(b.hasOwnProperty(d)){e=b[d];if(typeof e!="function"){c.push(f);l(a,d,c);c.push(":");j(a,e,c);f=","}}c.push("}");break;
case "function":break;default:throw Error("Unknown type: "+typeof b);}}var m={'"':'\\"',"\\":"\\\\","/":"\\/","\u0008":"\\b","\u000c":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\u000b":"\\u000b"},n=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;function l(a,b,c){c.push('"',b.replace(n,function(f){if(f in m)return m[f];var d=f.charCodeAt(0),e="\\u";if(d<16)e+="000";else if(d<256)e+="00";else if(d<4096)e+="0";return m[f]=e+d.toString(16)}),'"')};window.JSON||(window.JSON={});if(typeof window.JSON.serialize!=="function")window.JSON.serialize=i;if(typeof window.JSON.parse!=="function")window.JSON.parse=h;

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
var userStream = [];//user comments, whichever type
var sysStream = [];//system todo
var newStream = [];
var theonlycondition = false;

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
var activityDurations = [1,5,10,15,20,30,45, 60, 75, 90, 105, 120, 180, 240, 300,360,420,480]; // in minutes
//var campuslocations = [];
var lastSearch = null;
var lasteditSearch = null;

// task variables
var tid = null;
var uid = null; // TODO: get user id from parameters
var user = null;
var numusers = null;
var lock = false;

function closeAdd(){
    $('#searchBox').val(emptyText);
    $('#searchBox').css('color', 'gray');
    newactpinMoved = false;
    $('#box').css('top', '-700px');
    $('#overlay').css('display', 'none');
    $('#viewMission').css('display', 'none');
    $('#viewHelp').css('display', 'none');
    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewActivity').hide();
    $('#viewSelect').hide();
    $('#editActivity').hide();
    $('#editNote').hide();
    $('#editEnd').hide();
    $('#editStart').hide();
}

function readyAdd(){
    $('#boxclose').click(function(){
	closeAdd();
//	$('#box').css('top', '-700px');
//	$('#overlay').css('display', 'none');
        // $('#box').animate({'top':'-500px'},500,function(){
        //     $('#overlay').fadeOut('fast');
        // });
    });


}

function readySearchBox(){


    $('#searchBox').blur(function(){
	if($(this).val() == ''){
	    $(this).val(emptyText);
	    $(this).css('color', 'gray');
	}
    });

    $('#searchBox').focus(function(){
	if($(this).val() == emptyText){
	    $(this).val('');
	    $(this).css('color', 'black');
	}
    });

    searchAutocomplete = $('#searchBox').autocomplete({
    	minLength: 2,
    	source: userStream, 
    	select: function( event, ui ) {
    	    var item = ui.item;
	    $('#searchBox').val(item.value);
	    openItem(item);
    	    return false;
    	}
    });

    return;
}


function GetNewActMap(){
    newactmap = new VEMap('addmapDiv');
  
// + (end.lat - start.lat)/2, start.long + (end.long - start.long)/2);//new VELatLong(42.37355775, -71.1188900);
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

function OnTop(name){
    ontopname = name;
    return function RightOnTop(e){
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
	    if(lngdiff < 0.0004 && latdiff < 0.0004){
		// populate title
		e.Shape.SetTitle(shape.GetTitle());
		e.Shape.SetPoints(shape.GetPoints());
		e.Shape.SetCustomIcon('pin-start.png');
		newactmap.SetCenter(shape.GetPoints()[0]);
			
		$(name).val(shape.GetTitle());
	    }
	}
    };
}


function GetRoute(locations){
    slRoute.DeleteAllShapes();
    var credentials = "AmoK7LJck9Ce_JO_n_NAiDlRv88YZROwdvPzWdLi57iP3XQeGon28HJVdnHsUSkp";
    restDrive = [];
    restWalk = [];
    indexArr = [];
    for(var i = 0; i < locations.length - 1; i++){
	restDrive.push(null);
	restWalk.push(null);
	indexArr.push(i);
    }

    // for(var i = 0; i < locations.length - 1; i++){
    // 	var str = "wayPoint.1" + "=" + locations[i].Latitude + "," + locations[i].Longitude + "&";
    // 	str += "wayPoint.2" + "=" + locations[i+1].Latitude + "," + locations[i+1].Longitude;
    // 	// do a i to i + 1 route
    // 	var driveStr = "http://dev.virtualearth.net/REST/v1/Routes/Driving?" + str + "&routePathOutput=Points&output=json&distanceUnit=mi&key=" + credentials + "&jsonp=?";
    // 	var walkStr = "http://dev.virtualearth.net/REST/v1/Routes/Walking?" + str + "&routePathOutput=Points&output=json&distanceUnit=mi&key=" + credentials + "&jsonp=?";
    // 	$.getJSON(driveStr, GenerateCB(i, 'drive'));
    // 	$.getJSON(walkStr, GenerateCB(i, 'walking'));
    // }

    $(indexArr).each(function(){
	var i = this;
    	var str = "wayPoint.1" + "=" + locations[i].Latitude + "," + locations[i].Longitude + "&";
    	str += "wayPoint.2" + "=" + locations[i+1].Latitude + "," + locations[i+1].Longitude;
    	// do a i to i + 1 route
    	var driveStr = "http://dev.virtualearth.net/REST/v1/Routes/Driving?" + str + "&routePathOutput=Points&output=json&distanceUnit=mi&key=" + credentials + "&jsonp=?";
    	var walkStr = "http://dev.virtualearth.net/REST/v1/Routes/Walking?" + str + "&routePathOutput=Points&output=json&distanceUnit=mi&key=" + credentials + "&jsonp=?";
	
    	$.getJSON(driveStr, GenerateCB(i, 'drive'));
    	$.getJSON(walkStr, GenerateCB(i, 'walking'));
    });
}

function GenerateCB(z, type){
    return function MyCallBack(result){
	var val = result;
	if (result &&
            result.resourceSets &&
            result.resourceSets.length > 0 &&
            result.resourceSets[0].resources &&
	    result.resourceSets[0].resources.length > 0) {
	}else{
	    val = false;
	}
	
	if(type =='drive'){
	    restDrive[z] = result;	
	}else{
	    restWalk[z] = result;
	}
	
	if(gotAllPieces()){
	    composeRoute();
	    
	}
    };

}

function gotAllPieces(){
    return (restDrive.length == restDrive.filter(function (x) { return x != null; }).length &&
	    restWalk.length == restWalk.filter(function (x) { return x != null; }).length);
}

function composeRoute(){
    // got all pieces
    var legTimes = [];
    var mode = [];
    
    // 1. Figure out the composition before doing anything else
    for(var i = 0; i < restDrive.length; i++){
	var driveTime = null;
	var walkTime = null;
	if(restDrive[i]){
	    driveTime = restDrive[i].resourceSets[0].resources[0].routeLegs[0].travelDuration;
	}
	if(restWalk[i]){
	    walkTime = restWalk[i].resourceSets[0].resources[0].routeLegs[0].travelDuration;
	}

	var routeline;

	var walkOnly = false;
	var driveOnly = false;
	if(driveTime == null){
	    walkOnly = true;
	}
	if(walkTime == null){
	    driveOnly = true;
	}

	if(!driveOnly && (walkOnly || driveTime * 1.2 > walkTime || walkTime < 15 * 60)){
	    mode.push('walk');
	    legTimes.push(walkTime);
	    routeline = restWalk[i].resourceSets[0].resources[0].routePath.line;
	   // alert("walking part " + i);
	 }else{
	     mode.push('drive');
	     legTimes.push(driveTime);
	     routeline = restDrive[i].resourceSets[0].resources[0].routePath.line;
	  //  alert("driving part " + i);
	 }

	var routepoints = new Array();
        for (var j = 0; j < routeline.coordinates.length; j++) {
	    routepoints[j]=new VELatLong(routeline.coordinates[j][0], routeline.coordinates[j][1]);
        }
        // Draw the route on the map
        var shape = new VEShape(VEShapeType.Polyline, routepoints);
	
//	shape.SetLineColor(new VEColor(3, 209, 92, 1));
//	shape.SetLineColor(new VEColor(40, 209,40, 1));
//	if(mode[i] == 'drive'){
	    shape.SetLineColor(new VEColor(0,200,0,1));
//	}else{
//	    shape.SetLineColor(new VEColor(200,0,0,1));
//	}
//	shape.SetLineWidth(2);
	shape.SetLineWidth(3);

	shape.HideIcon();
	shape.SetTitle("MyRoute");
	shape.SetZIndex(1000, 2000);
	slRoute.AddShape(shape);
    }

    var time = beginTime;
    var i = 0;
    
    $('.ittime').each(function(){
	time += Math.round(legTimes[i] / 60);
	var next = time + wayhash[itinerary[i]].duration;
	$(this).html('(' + minToTime(time) + '-' + minToTime(next) + ')');
	time = next;
	i++;
    });
    
    // set end time
    var actualend = time + Math.round(legTimes[i] / 60);
    updateScheduleConstraints(actualend);
    
    if(actualend > endTime){
	$('.endtime').last().html("<font color='red'>(" + minToTime(actualend) + ')</font>');
	//	$('#totaltriptime').html("<font color='red'>" + readMinutes(actualend - beginTime) + '</font>');
    }else{
	$('.endtime').last().html('(' + minToTime(actualend) + ')');
	
    }
    $('#totaltriptime').html(readMinutes(actualend - beginTime));
	
    restDrive = null;
    restWalk = null;
}

function GetRouteREST(locations)
{
    slRoute.DeleteAllShapes();
    var str = "http://dev.virtualearth.net/REST/v1/Routes?";
    for(var i = 0; i < locations.length; i++){
	str += "wayPoint." + (i+1) + "=" + locations[i].Latitude + "," + locations[i].Longitude;
	if(i != locations.length - 1){
	    str += "&";
	}
    }

    var credentials = "AmoK7LJck9Ce_JO_n_NAiDlRv88YZROwdvPzWdLi57iP3XQeGon28HJVdnHsUSkp";
    str += "&routePathOutput=Points&output=json&distanceUnit=mi&key=" + credentials + "&jsonp=?";
    //RouteCallback&
    
    $.getJSON(str, function(result) {
	RouteCallback(result);

    });

    // var script = document.createElement("script");
    // script.setAttribute("type", "text/javascript");
    // script.setAttribute("src", str);
    // document.body.appendChild(script);
}

function RouteCallback(result) {

 //   alert(JSON.stringify(result));
  //  return;
    if (result &&
                   result.resourceSets &&
                   result.resourceSets.length > 0 &&
                   result.resourceSets[0].resources &&
        result.resourceSets[0].resources.length > 0) {
                   
        //              // Set the map view
        // var bbox = result.resourceSets[0].resources[0].bbox;
        // var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(bbox[0], bbox[1]), new Microsoft.Maps.Location(bbox[2], bbox[3]));
        // map.setView({ bounds: viewBoundaries});

        // Draw the route
        var routeline = result.resourceSets[0].resources[0].routePath.line;
	var route = result.resourceSets[0].resources[0];
//	alert(JSON.stringify(route));
        var routepoints = new Array();
                     
        for (var i = 0; i < routeline.coordinates.length; i++) {

            routepoints[i]=new VELatLong(routeline.coordinates[i][0], routeline.coordinates[i][1]);
        }

                     
                     // Draw the route on the map

        var shape = new VEShape(VEShapeType.Polyline, routepoints);
	shape.SetLineColor(new VEColor(3, 209, 92, 1));
	shape.SetLineWidth(2);
	shape.HideIcon();
	shape.SetTitle("MyRoute");
	shape.SetZIndex(1000, 2000);
	slRoute.AddShape(shape);



	var legTimes = [];
	for(var i = 0; i < route.routeLegs.length; i++){
	    legTimes.push(route.routeLegs[i].travelDuration);
	}
	
	var time = beginTime;
	var i = 0;
	
	$('.ittime').each(function(){
	    time += Math.round(legTimes[i] / 60);
	    var next = time + wayhash[itinerary[i]].duration;
	    $(this).html('(' + minToTime(time) + '-' + minToTime(next) + ')');
	    time = next;
	    i++;
	});
	
	// set end time
	var actualend = time + Math.round(legTimes[i] / 60);
	updateScheduleConstraints(actualend);
	
	
    if(actualend > endTime){
	$('.endtime').last().html("<font color='red'>(" + minToTime(actualend) + ')</font>');
	//	$('#totaltriptime').html("<font color='red'>" + readMinutes(actualend - beginTime) + '</font>');
    }else{
	$('.endtime').last().html('(' + minToTime(actualend) + ')');
	
    }
	$('#totaltriptime').html(readMinutes(actualend - beginTime));
	
	
        
    }
}


function GetRouteOld(locations)
{
    var options = new VERouteOptions;
            

    // Get WALKING directions
    options.RouteMode = VERouteMode.Walking;
    
    // We will draw route ourselves
    options.DrawRoute      = false;
    
    // So the map doesn't change:
    options.SetBestMapView = true;
    
    // Call this function when map route is determined
    options.RouteCallback  = ProcessWalkingRoute;
    
    // Show as miles
    options.DistanceUnit   = VERouteDistanceUnit.Mile;
    
    // Show the disambiguation dialog
    options.ShowDisambiguation = false;

    slRoute.DeleteAllShapes();

    if(locations.length <= 25){
	map.GetDirections(locations, options);
    }else{
	GetLongRoute(locations);
    }
}

function GetLongRoute(locations){
    var options = new VERouteOptions;
            
    // Get WALKING directions
    options.RouteMode = VERouteMode.Walking;
    
    // We will draw route ourselves
    options.DrawRoute      = false;
    
    // So the map doesn't change:
    options.SetBestMapView = false;
    
    // Call this function when map route is determined:
    options.RouteCallback  = ProcessPartialRoute;
    
    // Show as miles
    options.DistanceUnit   = VERouteDistanceUnit.Mile;
    
    // Show the disambiguation dialog
    options.ShowDisambiguation = false;

    remainingRoute = locations;

    var locs = [];
    var breaksize = 25;
    for(var j = 0; j < locations.length && j < breaksize; j++){
	locs.push(locations[j]);
    }

    remainingRoute.splice(0, breaksize-1);
    // got my segment
    map.GetDirections(locs,options);
}



function ProcessPartialRoute(route){
    var shape = new VEShape(VEShapeType.Polyline, route.ShapePoints);
    shape.SetLineColor(new VEColor(3, 209, 92, 1));
    shape.SetLineWidth(2);
    shape.HideIcon();
    shape.SetTitle("MyRoute");
    shape.SetZIndex(1000, 2000);
    slRoute.AddShape(shape);

    for(var i = 0; i < route.RouteLegs.length; i++){
	longLegs.push(route.RouteLegs[i].Time);
    }
 
    if(remainingRoute.length <= 1){
	var time = beginTime;
	var i = 0;

	$('.ittime').each(function(){
	    time += Math.round(longLegs[i] / 60);
	    var next = time + wayhash[itinerary[i]].duration;
	    
	    $(this).html('(' + minToTime(time) + '-' + minToTime(next) + ')');
	    time = next;
	    i++;
	});
	
	// set end time
	var actualend = time + Math.round(longLegs[i] / 60);
	
	updateScheduleConstraints(actualend);
	
	if(actualend > endTime){
	    $('.endtime').last().html("<font color='red'>(" + minToTime(actualend) + ')</font>');
//	$('#totaltriptime').html("<font color='red'>" + readMinutes(actualend - beginTime) + '</font>');
	}else{
	    $('.endtime').last().html('(' + minToTime(actualend) + ')');

	}
	$('#totaltriptime').html(readMinutes(actualend - beginTime));
	longLegs = [];
	return;
    }else{


	GetLongRoute(remainingRoute);
    }
}




function ProcessWalkingRoute(route){
    // first called
    var shape = new VEShape(VEShapeType.Polyline, route.ShapePoints);
    shape.SetLineColor(new VEColor(3, 209, 92, 1));
    shape.SetLineWidth(2);
    shape.HideIcon();
    shape.SetTitle("MyRoute");
    shape.SetZIndex(1000, 2000);
    slRoute.AddShape(shape);

    var legTimes = [];
    for(var i = 0; i < route.RouteLegs.length; i++){
	legTimes.push(route.RouteLegs[i].Time);
    }

    var time = beginTime;
    var i = 0;

     $('.ittime').each(function(){
	 time += Math.round(legTimes[i] / 60);
	 var next = time + wayhash[itinerary[i]].duration;
	 $(this).html('(' + minToTime(time) + '-' + minToTime(next) + ')');
	 time = next;
	 i++;
     });

    // set end time
    var actualend = time + Math.round(legTimes[i] / 60);
    updateScheduleConstraints(actualend);


    if(actualend > endTime){
	$('.endtime').last().html("<font color='red'>(" + minToTime(actualend) + ')</font>');
//	$('#totaltriptime').html("<font color='red'>" + readMinutes(actualend - beginTime) + '</font>');
    }else{
	$('.endtime').last().html('(' + minToTime(actualend) + ')');

    }
	$('#totaltriptime').html(readMinutes(actualend - beginTime));

}



function ProcessDrivingRoute(route){
    var shape = new VEShape(VEShapeType.Polyline, route.ShapePoints);
    shape.SetLineColor(new VEColor(3, 209, 92, 1));
    shape.SetLineWidth(2);
    shape.HideIcon();
    shape.SetTitle("MyRoute");
    shape.SetZIndex(1000, 2000);
    slRoute.AddShape(shape);

    var legTimes = [];
    for(var i = 0; i < route.RouteLegs.length; i++){
	legTimes.push(route.RouteLegs[i].Time);
    }

    var time = beginTime;
    var i = 0;

     $('.ittime').each(function(){
	 time += Math.round(legTimes[i] / 60);
	 var next = time + wayhash[itinerary[i]].duration;
	 $(this).html('(' + minToTime(time) + '-' + minToTime(next) + ')');
	 time = next;
	 i++;
     });

    // set end time
    var actualend = time + Math.round(legTimes[i] / 60);
    updateScheduleConstraints(actualend);


    if(actualend > endTime){
	$('.endtime').last().html("<font color='red'>(" + minToTime(actualend) + ')</font>');
//	$('#totaltriptime').html("<font color='red'>" + readMinutes(actualend - beginTime) + '</font>');
    }else{
	$('.endtime').last().html('(' + minToTime(actualend) + ')');

    }
	$('#totaltriptime').html(readMinutes(actualend - beginTime));

}

function GetMap()
{
    
    map = new VEMap('mapDiv');
    var mapOptions = new VEMapOptions();
    mapOptions.DashboardColor = 'black';
    mapOptions.UseEnhancedRoadStyle = true;

    mapCenter = new VELatLong(start.lat, start.long);
    //      map.SetCredentials("AmoK7LJck9Ce_JO_n_NAiDlRv88YZROwdvPzWdLi57iP3XQeGon28HJVdnHsUSkp");
    map.LoadMap(mapCenter, defaultZoom, 'r', false, VEMapMode.Mode2D, true, 0, mapOptions);
//new VELatLong(42.37355775, -71.1188900)
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

function AddPushpin(m, ll,title, desc, canDrag, custom)
      {
	  if(ll == null) ll = m.GetCenter();
	  
	  var shape = new VEShape(VEShapeType.Pushpin, ll);
	  shape.SetTitle(title);
	  shape.SetDescription(desc);
	  if(custom != null){
	      shape.SetCustomIcon(custom);
	  }
	  m.AddShape(shape);
	  shape.Draggable = canDrag;
	  return shape;
      }

function FindNearby() {
    // TODO: can choose a where
      
    var txt = $('#txtWhat').val();
    findLayer.DeleteAllShapes();
 

      try
	  {
	      map.Find(txt, null, null, findLayer,0,10,true,true,true,true, processFind);
	  }
      catch(e){
	  alert(e.message);
      }

}


function autoNearby() {
    if(!donearby){
	donearby = true;
	return;
    }
    // puts nearby on new activity map
    var txt = $('#addactloc').val();
    if(txt == lastSearch) {
	return;
    }else{
	lastSearch = txt;
    }

    actfindLayer.DeleteAllShapes();
    try
    {
	newactmap.Find(txt, null, null, actfindLayer,0,10,true,true,true,true, processFind);
//	var options = new VESearchOptions;
//	options.ShapeLayer = actfindLayer;
//	newactmap.Search(txt, processFind, options);
    }
    catch(e){
	alert(e.message);
    }
}



function editEndsNearby() {
    if(!donearby){
	donearby = true;
	return;
    }
    // puts nearby on new activity map
    var txt = $(ontopname).val();
    if(txt == lastSearch) {
	return;
    }else{
	lastSearch = txt;
    }

    actfindLayer.DeleteAllShapes();
    try
    {
	newactmap.Find(txt, null, null, actfindLayer,0,10,true,true,true,true, processFind);
//	var options = new VESearchOptions;
//	options.ShapeLayer = actfindLayer;
//	newactmap.Search(txt, processFind, options);
    }
    catch(e){
	alert(e.message);
    }
}

function editAutoNearby() {
    if(!donearby){
	donearby = true;
	return;
    }
    // puts nearby on new activity map
    var txt = $('#editactloc').val();
    if(txt == lasteditSearch) {
	return;
    }else{
	lasteditSearch = txt;
    }

    actfindLayer.DeleteAllShapes();
    try
    {
	newactmap.Find(txt, null, null, actfindLayer,0,10,true,true,true,true, processFind);
//	var options = new VESearchOptions;
//	options.ShapeLayer = actfindLayer;
//	newactmap.Search(txt, processFind, options);
    }
    catch(e){
	alert(e.message);
    }
}

function computeDistance(l1, l2){
    var ret = Math.sqrt((l1.Latitude - l2.Latitude) * (l1.Latitude - l2.Latitude) + (l1.Longitude - l2.Longitude) * (l1.Longitude - l2.Longitude));
    return ret;
}

function toler(tolerance){
    // get something random between tolerance and 2x tolernace
    var ret;
    return  tolerance + Math.random() * tolerance;
}

function randSign(){
    if(Math.random() > 0.5){
	return 1;
    }else{
	return -1;
    }
}

function AddWaypointPin(si){
    

    var ll = new VELatLong(si.data.location.lat, si.data.location.long);

    // check no pin already at same location
    var count = waylayer.GetShapeCount();
    for(var i = 0; i < count; i++){
	var shape = waylayer.GetShapeByIndex(i);
	if(computeDistance(shape.GetPoints()[0], ll) < tolerance){
	    var dx = toler(tolerance) * randSign();
	    var dy = toler(tolerance) * randSign();
	    ll = new VELatLong(parseFloat(si.data.location.lat) + dx, parseFloat(si.data.location.long) + dy);
	}
    }
    
    
    if(computeDistance(startPin.GetPoints()[0], ll) < tolerance || computeDistance(endPin.GetPoints()[0], ll) < tolerance){
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

function processFind(a,b,c,d,e){
    if(b!= null && b.length > 1){
	var shape;
	var numResults = a.GetShapeCount();
	//alert("num shapes: " + numResults);
	for (var i = 0; i < a.GetShapeCount(); i++) {
	    shape = a.GetShapeByIndex(i);
	    //    alert(shape.GetTitle());
	    shape.SetCustomIcon("wp.gif"); 
	    shape.SetDescription(shape.GetDescription() + "<br/><br/><a href='#' onclick='moveact(" + i +  ")' style='color:#0000CE'>Move location pin here</a>");
	    // shape.SetZIndex(1000, 1000);
	}
    }
}

function moveact(i){
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


function initMap(){
    GetMap();
    var startll = new VELatLong(start.lat, start.long);
    var endll = new VELatLong(end.lat, end.long);

    startPin = AddPushpin(map, startll, 'Start location', start.name, false, "pin-start.png");

    if(computeDistance(startll, endll) < tolerance){
	var dx = toler(tolerance) * randSign();
	var dy = toler(tolerance) * randSign();
	endll = new VELatLong(parseFloat(end.lat) + dx, parseFloat(end.long) + dy);
    }
    endPin = AddPushpin(map, endll, 'End location', end.name, false, "pin-end.png");    
}




var username = null;
var email = null;
var requestId = null;
var requestEmail = null;
var requestItem = null;
var state; // state of the world
var stateId = null;
var preferenceOrdering = null; // ordering on previous preferences
var userKeys = [];//todo, more efficient
var newFieldId = 0;
var newPreferenceId = 0;
var newChoices = [];
var newPreferences = [];
var planByCategory = true;

// TODO: load work others have done so far
function showProgress(){
     jQuery.ajax({
      type: "GET",
      url: "http://people.csail.mit.edu/hqz/mobi/showProgress.php",
      data: ({type: "potluck", id: tid}),
      success: function(table){
          // assume json object we can work with
		 //alert(obj);
          jQuery('#tasklist').html(table);
	     }
	 });
    return;
}

function minToTime(time){
    var AMPM = 'am';
    var minutes = time % 60;
    var hour = Math.floor(time / 60);

    if(hour >= 12) {
	AMPM = 'pm';
	if(hour > 12){
	    hour -= 12;
	}
    }
    if(minutes < 10){
	minutes = '0' + minutes;
    }
    return hour + ":" + minutes + AMPM;
}

function streamitem(type, data, time){
    this.type = type;
    this.data = data;
    if(time == null){
	var t = new Date();
	this.createTime = t.getTime();
    }else{
	this.createTime = time;
    }
    this.value = data.name;
    this.label = [data.name, data.description, data.categories.join(' ')].join(' ');
    if(this.type != 'todo'){
	this.creator = user.name;
    }
}

function readMinutes(time){
    var h = ' hour';
    var hs = '';
    var m = ' minute';
    var ms = '';

    var hour = Math.floor(time / 60);
    var minutes = time % 60;

    if(minutes > 1){
	ms = 's';
    }
    if(hour > 1){
	hs = 's';
    }

    if(hour == 0){
	return minutes + m + ms;
    }else {
	if(minutes == 0){
	    return hour + h + hs;
	}else{
	    return hour + h + hs + ' and ' + minutes + m + ms;
	}
    }
}
   
function addActivity(){
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
    if(txt != emptyText){
	$('#addacttitle').val(txt);
    }else{
	$('#addacttitle').val('');
    }

    $('#addactdesc').val('');
    $('#addactloc').val('');
    
    
    $('#addactduration').empty();
    actfindLayer.DeleteAllShapes();
    // options
    for(var i = 0; i <  activityDurations.length; i++){
	var o = $(document.createElement('option'));
	o.attr('value', activityDurations[i]);
	o.text(readMinutes(activityDurations[i]));
	$('#addactduration').append(o);
    }


    // location, autocomplete
    if(locationAutocomplete == null){
	locationAutocomplete = $("input#addactloc").autocomplete({
	    minLength: 3,
	    source: getLocations(),
	    select: function( event, ui ) {
		donearby = false;
		actfindLayer.DeleteAllShapes();
		var loc = ui.item;
		$('#addactloc').val(loc.data.location.name);
		var latlong = new VELatLong(loc.data.location.lat, loc.data.location.long);
		newactPin.SetPoints([latlong]);
		newactPin.SetTitle(loc.data.location.name);
		newactPin.SetCustomIcon('pin-start.png');
		newactmap.SetCenter(latlong);
		newactpinMoved = true;
		return false;
	    }
	    
	});
    }


    // categories
    $('#addacttags').empty();
    var s = $(document.createElement('table'));
    for(var i = 0; i < categories.length; i+=2){
	var c;
	if(i == categories.length -1){
	    c  = "<tr><td><input type='checkbox' value='" + i + "' />" + categories[i] + "</td></tr>";
	}else{
	    c = "<tr><td><input type='checkbox' value='" + i + "' />" + categories[i] + "</td>";
	    c += "<td><input type='checkbox' value='" + (i+1) + "' />" + categories[i+1] + "</td></tr>"; 	   
	}
	s.append(c);
    }
    $('#addacttags').append(s);    

    // $('#addacttags').empty();
    // for(var i = 0; i < categories.length; i++){
    // 	var c = "<input type='checkbox' value='" + i + "' />" + categories[i] + "<br/>";
    // 	$('#addacttags').append(c);
    // }

    
   $('#overlay').fadeIn('fast',function(){
        $('#box').animate({'top':'20px'},500);
   });
}


function viewNote(si){

    $('#box').css('left', '30%');
    $('#box').css('right', '30%');

    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').show();
    $('#viewActivity').hide();
    

    $('#viewtitle').html(si.data.name);   
    $('#viewdesc').html(si.data.description);
    $('#viewtags').empty();
    for(var i = 0; i < si.data.categories.length; i++){
	var d = ', ';
	if(i == si.data.categories.length - 1){
	    d = '';
	}
	var c = si.data.categories[i] + d;
	$('#viewtags').append('#' + c);
    }

    if(si.id.substring(0,4) =='user'){
	// edit button

	$('#editnotebutton').disabled = 'false';
	$('#editnotebutton').text('edit note');
	$('#editnotebutton').css('background', '#ffab07');
	$('#editnotebutton').unbind();
	$('#editnotebutton').click(function(){
	    editNote(si);
	});
	$('#editnotebutton').show();
    }else{
	$('#editnotebutton').hide();
    }
    $('#overlay').fadeIn('fast',function(){
        $('#box').animate({'top':'20px'},500);
    });
}



function viewActivity(si){
    //    alert(si.id);
    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    $('#addActivity').css('display', 'none');
    $('#addNote').css('display','none');
    $('#viewNote').css('display','none');
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
    if(include(itinerary, si.id)){
	// make button disabled;
//	$('#addacttoitbutton').disabled = 'true';
	$('#addacttoitbutton').text("remove from itinerary");
	$('#addacttoitbutton').css('background', '#ffab07');
	$('#addacttoitbutton').unbind();	
	$('#addacttoitbutton').click(function(){
	    
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
    
	    // get rid of the itinerary badge
	    $('#ss_' + si.id).remove();

	    // update display
	    updateItineraryDisplay();

	    saveItinerary();
//	    enableItSave();
	    

	    closeAdd();
	});
    }else{
	// enable the button
	$('#addacttoitbutton').disabled = 'false';
	$('#addacttoitbutton').text('add it to the itinerary');
	$('#addacttoitbutton').css('background', '#ffab07');
	$('#addacttoitbutton').unbind();
	$('#addacttoitbutton').click(function(){
	    addActivityToItinerary(si);
	    closeAdd();
	});
    }
    

	// edit button
	$('#editacttoitbutton').disabled = 'false';
	$('#editacttoitbutton').text('edit activity');
	$('#editacttoitbutton').css('background', '#ffab07');
	$('#editacttoitbutton').unbind();
	$('#editacttoitbutton').click(function(){
	    editActivity(si);
	});


    $('#viewacttitle').html(si.data.name);   
    $('#viewactdesc').html(si.data.description);
    $('#viewactloc').html(si.data.location.name);
    $('#viewactduration').html(readMinutes(si.data.duration));
    $('#viewacttags').empty();
    for(var i = 0; i < si.data.categories.length; i++){
	var d = ', ';
	if(i == si.data.categories.length - 1){
	    d = '';
	}
	var c = si.data.categories[i] + d;
	$('#viewacttags').append('#' + c);
    }

    $('#overlay').fadeIn('fast',function(){
        $('#box').animate({'top':'20px'},500);
    });

}

function setTimeField(name, time){
    for(var i = 0; i < 24; i++){
	for(var j = 0; j <= 45; j +=30){
	    var o = $(document.createElement('option'));
	    o.val(i*60 + j);
	    if(time == i*60+j){
		o.attr('selected', 'selected');
	    }
	    var is = i;
	    var js = j;
	    
	    if(j == 0) js = '00';
	    if(i < 12){
		o.text(is + ":" + js + " AM");
	    }else{
		if(i == 12){
		    o.text(is + ":" + js + " PM");
		}else{
		    o.text((is-12) + ":" + js + " PM");
		}
	    }
	    
	    $(name).append(o);
	}
    }
}


function editStart(){
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
    $('#saveeditstartbutton').click(function(){
	if(start.name != $('#editstartloc').val()){
	    start.name = 'arrive at ' + $('#editstartloc').val();
	    $('.itname').first().html(start.name);
	}

	start.name = $('#editstartloc').val();
	start.lat = newactPin.GetPoints()[0].Latitude;
	start.long = newactPin.GetPoints()[0].Longitude;


	if(beginTime != $('#editstarttime').val()){
	    
	    beginTime = parseInt($('#editstarttime').val());
	    $('.endtime').first().html('(' + minToTime(beginTime) + ')');
	}

	startPin.SetPoints(new VELatLong(0.00005 + start.lat, 0.00005 + start.long));
	startPin.SetDescription($('#editstartloc').val());
	saveEditEnds();
	updateItineraryDisplay();
    });

    $('#editstartloc').val(start.name);

    setTimeField('#editstarttime', beginTime);
    
    // location, autocomplete
//    if(editlocationAutocomplete == null){
	editlocationAutocomplete = $("input#editstartloc").autocomplete({
	    minLength: 3,
	    source: getLocations(),
	    select: function( event, ui ) {
		donearby = false;
		actfindLayer.DeleteAllShapes();
		var loc = ui.item;
		$('#editstartloc').val(loc.data.location.name);
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

   $('#overlay').fadeIn('fast',function(){
        $('#box').animate({'top':'20px'},500);
   });
}



function editEnd(){
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
    $('#saveeditendbutton').click(function(){
	if(end.name != $('#editendloc').val()){
	    end.name = 'arrive at ' + $('#editendloc').val();
	    $('.itname').last().html(end.name);
	}
	end.lat = newactPin.GetPoints()[0].Latitude;
	end.long = newactPin.GetPoints()[0].Longitude;


	if(endTime != $('#editendtime').val()){
	    endTime = parseInt($('#editendtime').val());
	    $('.endtime').last().html('(' + minToTime(endTime) + ')');
	}

	endPin.SetPoints(new VELatLong(0.00005 + end.lat, 0.00005 + end.long));
	endPin.SetDescription($('#editendloc').val());
	saveEditEnds();
	updateItineraryDisplay();
    });

    $('#editendloc').val(end.name);

    setTimeField('#editendtime', endTime);
    
    // location, autocomplete
//    if(editlocationAutocomplete == null){
	editlocationAutocomplete = $("input#editendloc").autocomplete({
	    minLength: 3,
	    source: getLocations(),
	    select: function( event, ui ) {
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

   $('#overlay').fadeIn('fast',function(){
        $('#box').animate({'top':'20px'},500);
   });
}

function editActivity(si){
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
    $('#saveeditbutton').click(function(){
	saveEditActivity(si);
    });

    $('#editacttitle').val(si.data.name);
    $('#editactdesc').val(si.data.description);
    $('#editactloc').val(si.data.location.name);

    // options
    for(var i = 0; i <  activityDurations.length; i++){
	var o = $(document.createElement('option'));
	o.attr('value', activityDurations[i]);
	o.text(readMinutes(activityDurations[i]));
	if(activityDurations[i] == si.data.duration){
	    o.attr('selected', 'selected');
	}

	$('#editactduration').append(o);

    }

    // location, autocomplete
//    if(editlocationAutocomplete == null){
	editlocationAutocomplete = $("input#editactloc").autocomplete({
	    minLength: 3,
	    source: getLocations(),
	    select: function( event, ui ) {
		donearby = false;
		actfindLayer.DeleteAllShapes();
		var loc = ui.item;
		$('#editactloc').val(loc.data.location.name);
		var latlong = new VELatLong(loc.data.location.lat, loc.data.location.long);
		newactPin.SetPoints([latlong]);
		newactPin.SetTitle(loc.data.location.name);
		newactPin.SetCustomIcon('pin-start.png');
		newactmap.SetCenter(latlong);
		newactpinMoved = true;
		return false;
	    }
	    
	});
  //  }

    // categories
    $('#editacttags').empty();
    var s = $(document.createElement('table'));
    for(var i = 0; i < categories.length; i+=2){
	var c;
	var d;
	var d1;
	var d2;
	if(i == categories.length - 1){
	    if(include(si.data.categories, categories[i])){
		d = "<input type='checkbox' value='" + i + "' checked/>" + categories[i];
	    }else{
		d= "<input type='checkbox' value='" + i + "' />" + categories[i];
	    }
	    c = "<tr><td>" + d + "</td></tr>";
	}else{// have two things
	    if(include(si.data.categories, categories[i])){
		d1 = "<input type='checkbox' value='" + i + "' checked/>" + categories[i];
	    }else{
		d1= "<input type='checkbox' value='" + i + "' />" + categories[i];
	    }
	    
	    if(include(si.data.categories, categories[i+1])){
		d2 = "<input type='checkbox' value='" + (i+1) + "' checked/>" + categories[i+1];
	    }else{
		d2= "<input type='checkbox' value='" + (i+1) + "' />" + categories[i+1];
	    }
	    c = "<tr><td>" + d1 + "</td>";
	    c += "<td>" + d2 + "</td></tr>";
	}
	s.append(c);
    }
    $('#editacttags').append(s);

    // $('#editacttags').empty();
    // for(var i = 0; i < categories.length; i++){
    // 	var c;
    // 	if(include(si.data.categories, categories[i])){
    // 	    c = "<input type='checkbox' value='" + i + "' checked/>" + categories[i] + "<br/>";
    // 	}else{
    // 	    c = "<input type='checkbox' value='" + i + "' />" + categories[i] + "<br/>";
    // 	}
    // 	$('#editacttags').append(c);
    // }

    
   $('#overlay').fadeIn('fast',function(){
        $('#box').animate({'top':'20px'},500);
   });
}

function getLocations(){
    // look through all the data we have to get locations of those places
    var namedlocations =  userStream.filter(function(x) {
	return x.type == 'activity';
    });
    return namedlocations.map(function (x) {
	x.label = x.data.location.name;
	x.value = x.data.location.name;
	return x;
    });
}

function editNote(si){
    $('#box').css('left', '30%');
    $('#box').css('right', '30%');

    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewActivity').hide();

    $('#editNote').show();

    
    
    $('#saveeditnotebutton').unbind();
    $('#saveeditnotebutton').click(function(){
	saveEditNote(si);
    });

    $('#edittitle').val(si.data.name);
    $('#editdesc').val(si.data.description);

    // categories
    $('#edittags').empty();
    for(var i = 0; i < categories.length; i++){
	var c;
	if(include(si.data.categories, categories[i])){
	    c = "<input type='checkbox' value='" + i + "' checked/>" + categories[i] + "<br/>";
	}else{
	    c = "<input type='checkbox' value='" + i + "' />" + categories[i] + "<br/>";
	}
	$('#edittags').append(c);
    }

    
    $('#overlay').fadeIn('fast',function(){
        $('#box').animate({'top':'20px'},500);
    });
}

function addActivityToItinerary(si){
    // add the waypoint
    AddWaypointPin(si);
    // update itinerary ordering in actual data
    itinerary.unshift(si.id);
    // update sortable
    displayItineraryItem('#itinerary', si.id, true, 1, si.data.name, si.data.location.name, '' + si.data.duration + ' min + travel', true);

    // update stream to say it's in itinerary
    
    $('#stime_' + si.id).prepend(createInItineraryButton(si));
    
    // enable the save button

//    enableItSave();
    saveItinerary();

    updateItineraryDisplay();
    
}

function addSelect(){

    // display mission details;
    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewHelp').hide();
    $('#viewActivity').hide();
    $('#viewMission').hide();
    
    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

    $('#viewSelect').show();

    $('#overlay').fadeIn('fast',function(){
        $('#box').animate({'top':'20px'},500);
    });
}

function addNote(){
    $('#box').css('left', '30%');
    $('#box').css('right', '30%');

    $('#addActivity').hide();
    $('#addNote').show();
    $('#viewNote').hide();
    $('#viewActivity').hide();

    var txt = $('#searchBox').val();
    if(txt != emptyText){
	$('#addtitle').val(txt);
    }else {
	$('#addtitle').val('');
    }

    $('#adddesc').val('');
    $('#addtags').empty();
    for(var i = 0; i < categories.length; i++){
	var c = "<input type='checkbox' value='" + i + "' />" + categories[i] + "<br/>";
	$('#addtags').append(c);
    }

    $('#overlay').fadeIn('fast',function(){
        $('#box').animate({'top':'20px'},500);
    });
}

function saveAddNote(){
    var nname = $('#addtitle').val();
    if(rtrim(nname) == ''){
	alert("Please enter a title");
	return;
    }
    var ndesc = $('#adddesc').val();
    var ncat = ['note'];
    $('#addtags input:checked').each(function(){
	ncat.push(categories[$(this).val()]);
    });
    var n = new note(nname, ndesc, ncat);
    var si = new streamitem('note', n , null);
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


function checkTimeOut(){
    var timeNow = (new Date()).getTime();
    var secondsDiff = (timeNow - sessionStart)/1000;
    if(secondsDiff > timeoutin * 60){
	alert("You have been logged in for over " + timeoutin + " minutes. To avoid conflicts with others' edits, please refresh the page before continuing. We apologize for the inconvenience");
	return true;
    }else{
	return false;
    }
}

function saveEditActivity(oldsi){
    var oldid = oldsi.id;
    if(checkTimeOut()){
	closeAdd();
	return;
    }


    // name
    var nname = $('#editacttitle').val();
    if(rtrim(nname) == ''){
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
    $('#editacttags input:checked').each(function(){
	ncat.push(categories[$(this).val()]);
    });

    var n = new activity(nname, ndesc, null, nloc, null, ndur, ncat);

    var si = new streamitem('activity', n , null);
    si.liked = oldsi.liked;
    if(oldsi.edited == undefined){
	si.edited = [uid];
    }else{
	si.edited = oldsi.edited;
	si.edited.push(uid);
    }


    /// submit it
    var id = submitEdit(si, oldid);
    if(id != null){
	si.id = 'user_' + id;
    }else{
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
    for(var i = 0; i < itinerary.length; i++){
	if(itinerary[i] == oldid){
	    pos = i + 1;
	    itinerary.splice(i,1,si.id);
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

    for(var i = 0; i < userStream.length; i++){
	if(userStream[i].id == oldsi.id){
	    userStream.splice(i, 1);
	    break;
	}
    }

    if(initinerary){
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
    }



    closeAdd();
}



function saveEditNote(oldsi){

    // name
    var nname = $('#edittitle').val();
    if(rtrim(nname) == ''){
	alert("Please enter a title");
	return;
    }

    var ndesc = $('#editdesc').val();
    var ncat = ['note'];
    $('#edittags input:checked').each(function(){
	ncat.push(categories[$(this).val()]);
    });

    var n = new note(nname, ndesc, ncat);
    var si = new streamitem('note', n , null);
    si.liked = oldsi.liked;
    if(oldsi.edited == undefined){
	si.edited = [uid];
    }else{
	si.edited = oldsi.edited;
	si.edited.push(uid);
    }

    /// submit the edit
    var newid = submitEdit(si, oldsi.id);
    if(newid != null){
	si.id = 'user_' + newid;
    }else{
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

    for(var i = 0; i < userStream.length; i++){
	if(userStream[i].id == oldsi.id){
	    userStream.splice(i, 1);
	    break;
	}
    }
    
    closeAdd();
}



function saveAddActivity(streamonly){
    // name
    var nname = $('#addacttitle').val();
    if(rtrim(nname) == ''){
	alert("Please enter a title");
	return;
    }

    // check if location pin moved
    if(!newactpinMoved){
	var answer = confirm("It seems like you didn't move the location pin. Are you sure you want to continue?");
	if (answer){
	}
	else{
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
    $('#addacttags input:checked').each(function(){
	ncat.push(categories[$(this).val()]);
    });

    var n = new activity(nname, ndesc, null, nloc, null, ndur, ncat);

    var si = new streamitem('activity', n , null);
    si.edited = [uid];


    /// submit it
//    alert("Save add activity");
    var id = submitEntry(si);
//    alert(id);
    si.id = 'user_' + id;
    
    // add it to local stream
    userStream.unshift(si);
    searchAutocomplete.autocomplete("option", "source", userStream);
    newStream.unshift(si);

    var item = createStreamItem(si);
    $('#userStreamBody').prepend(item);
    

    //// 

    closeAdd();

    if(!streamonly){
	// also add to itinerary
	addActivityToItinerary(si);
    }

}

    function waypointPin(pin, ll, pos, duration){
	this.pin = pin;
	this.pos = pos;
	this.ll = ll;
	this.duration = duration;
    }

function updatePinNumber(pin, pos){
    // var str = "<table width='25px' height='26px'><tr><td style='background: url(" +  waypointIcon + ") no-repeat; vertical-align: top; text-align: center'><span style='font-weight: bold; color: #fff'>" + pos + "</span></td></tr></table>";

    var str = "<table><tr><td><div class='pinpos'>" + pos + "</div></td></tr></table>";
    pin.SetCustomIcon(str);
}



// save stream item on server, and then return its id
function submitEntry(si){
    var ret = null;
    jQuery.ajax({
	type: "POST",
	url: "http://people.csail.mit.edu/hqz/mobi/submitTourEntry.php",
	async: false,
	data: ({
	    userId : uid,
	    answer: JSON.stringify(si),
	    taskId: tid, 
	    type: "tour"}),
	success: function(msg){
	    ret = msg;
	    
	    
	     }
	 });
//    alert('first end');
    return ret;
 
}



// save stream item on server, and then return its id
function submitEdit(si, oldid){
//    alert('second start');

    oldid = parseInt(oldid.substring(5));

    var ret = null;
    jQuery.ajax({
	type: "POST",
	url: "http://people.csail.mit.edu/hqz/mobi/submitTourEdit.php",
	async: false,
	data: ({
	    userId : uid,
	    answer: JSON.stringify(si),
	    oldid: oldid,
	    taskId: tid, 
	    type: "tour"}),
	success: function(msg){
	    if(msg == ""){
		// cannot save it
		alert("It appears that someone else has recently edited the same thing that you are editing. Please refresh the page before continuing. We apologize for the inconvenience");
		
		//alert(msg);
		// ret = msg;
	    }else{
		ret = rtrim(msg);
	    }
	}
    });
	
    return ret;
}



function locationInfo(name, lat, long){
    this.name = name;
    this.lat = lat;
    this.long = long;
}

     
function displayTime(ms){

    //// trying pretty date
    var d = new Date(ms);
    return humane_date(d);

    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // convert from ms since 1970
    
    var ampm = 'AM';
    var hours = d.getHours()
    var minutes = d.getMinutes()
    var dayofweek = weekday[d.getDay()];
    
    if (minutes < 10){
	minutes = "0" + minutes
    }
    if(hours > 11){
	ampm = 'PM';
    } 
    if(hours > 12){
	hours -= 12;
    }
    return dayofweek + ",<br/>" + hours + ":" + minutes + " " + ampm;
}

function createStreamItem(si){
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
    for(var i = 0; i < si.data.categories.length; i++){
	descntag.append("<span style='float:left;white-space:no-wrap;'><a class='tagstreamitem' href='#' onclick=" + "\"filterOnTag('" + si.data.categories[i] + "')\">" + '#' + si.data.categories[i] + "</a></span>");
    }
    if(si.type != 'todo'){
	var likebutton="<a id='liked_" + si.id + "' class='likeItem' href='#' onclick=" + "\"like('" + si.id + "')\"" + " style='color:#0000CE'>Like</a> ";
	var dot = true;
	if(si.liked != undefined){

	    var liked = si.liked.filter(function(x) {return x != uid;});
	    if(liked.length != si.liked.length){
		likebutton ="";
	    dot = false;
	    }
	}

	var idea = '';
	if(si.edited != undefined)
	{

	    idea = "Idea from " + firstName(userKeys[si.edited[0]]) +" &#183; ";
	}
	

	descntag.append("<div style='clear:both;font-size:85%'>" + idea + likebutton + countLikes(si, dot) + "</div>");
//+ displayTime(si.createTime) + 
    }	

    

    // 	function(){
    // 	    setTimeout(function(){
    // 		$(item).unbind('click');
    // 		$(item).click(function(){
    // 		    openItem(si);
    // 		});
    // 	    }, 500);
    // 	});

    msg.append(descntag);

    var time = $(document.createElement('td'));
    time.css('width', '0%');
    time.attr('id', 'stime_' + si.id);
    var tt = $(document.createElement('div'));
    tt.addClass('badge_' + si.type);
    time.append(tt);

    if(include(itinerary, si.id)){
	time.prepend(createInItineraryButton(si));
    }

    item.append(msg);
    item.append(time);

    $(item).unbind();
    $(item).click(function(){
	if(lock){
	    lock = false;
	}else{
	    openItem(si);
	}
    });
    $(item).attr('id', 'stream_' + si.id);

    return item;
}

function like(id){
    lock = true;
    var si = getItem(id);
    
    if(si.liked != undefined){
	if(si.liked.indexOf(uid) != -1){
	    alert("You have already noted that you like this idea!");
	    return;
	}else{
	    si.liked.push(uid);
	}
    }else{
	si.liked = [uid];
    }

    $("#liked_" + si.id).html('');
    if($('#likecount_' + si.id).length > 0){
	$("#likecount_" + si.id).remove();
	//html(countLikesHTML(si));	
	//	$("#likecount_" + si.id).html(countLikesHTML(si));
    }
//    }else{
	$("#liked_" + si.id).after(countLikes(si, false));
 //   }
    updateLike(si);
    
//    $('#stream_' + id).remove();    
//    displayStreamItem('#userStreamBody', si);
}

function updateLike(si){
    jQuery.ajax({
	type: "POST",
	url: "http://people.csail.mit.edu/hqz/mobi/updateLike.php",
	async: false,
	data: ({
	    userId : uid,
	    answer: JSON.stringify(si),
	    taskId: tid, 
	    id: parseInt(si.id.substring(5)),
	    type: "tour"}),
	success: function(msg){
//	    alert(msg);
	    if(msg == ""){
		// cannot save it
		alert("It appears that someone else has recently edited the item you like. Please refresh the page before continuing. We apologize for the inconvenience");
	    }
	}});
    return;
}
		
	       

function countLikes(si, breaker){
    var b = '&#183; ';
    if(!breaker){
	b = '';
    }
    if(si.liked != undefined){
	return "<span id='likecount_" + si.id + "'>" + b + countLikesHTML(si) + "</span>";
    }	
    
    return '';
}

function countLikesHTML(si){
   if(si.liked != undefined){
	var liked = si.liked.filter(function(x) {return x != uid;});
	if(liked.length == 0){
	    return "You like the idea";
	}else if(liked.length != si.liked.length){
	    // you and others like it
	    if(liked.length == 1){
		return "You and " + liked.length + " other like the idea";
	    }else{
		return "You and " + liked.length + " others like the idea";
	    }
	}else{
	    if(liked.length == 1){
		return "1 person like the idea";
	    }else{
		return liked.length + " people like the idea";
	    }
	}
    }	
    
    return '';

}

function createInItineraryButton(si){

    var sp = $(document.createElement('div'));
    sp.attr('id', 'ss_' + si.id);
    sp.addClass('sspinpos');
//    alert(wayhash[si.id]);
    if(wayhash[si.id] != undefined){
	sp.append(wayhash[si.id].pos);
    }
//    sp.append("<br/><button style='border:none;color:white;background:gray'>in itinerary</b>");
    return sp;
}

/// opens up the time for viewing, or additional editing...
function openItem(item){
//    var item = getItem(id);
  
    if(item.type == 'note' || item.type =='todo'){
	viewNote(item);
    }else if (item.type == 'activity'){
	viewActivity(item);
    }

}

// getter for locating an item..
function getItem(id){
    var stream;
    if(id.substring(0,4) == 'user'){
	stream = userStream;
    }else{
	stream = sysStream;
    }
    // return just the first element (since they are actually unique)
    var arr = stream.filter(function(x){
	return x.id == id;
    });
    if(arr != null && arr.length > 0){
	return arr[0];
    }else{

	return null;
    }
    
}

function displayStreamItem(id, si){
   
    var item = createStreamItem(si);
    $(id).prepend(item);
}

function rtrim(stt) {
    return stt.replace(/\s+$/,"");
}


function takeTill(str, maxchars){
    var str = rtrim(str.replace(/<br\/>/g, ' '));
    
    var sp = str.split(' ');
    var o = '';
    for(var i = 0; i < sp.length; i++){
	if(o.length + sp[i].length > maxchars){
	    var ret = rtrim(o) + ' [...]';
	    return ret;
	}else{
	    o += sp[i];
	    o += ' ';
	}
    }
    return rtrim(str);
}



function displayItineraryItem(name, id, move, pos, title, loc, time, isnew){
    var item = createItineraryItem(id, move, pos, title, loc, time, isnew);
    $(name).prepend(item);
}

function createItineraryItem(id, move, pos, title, loc, time, isnew){

    var w1 = '2%';
    var w2 = '60%';
    var w3 = '38%';
//    var w4 = '10%';
    
    var item = $(document.createElement('tr'));
    
    var itemPos = $(document.createElement('td'));
    itemPos.css('width', w1);
//    itemPos.css('float', 'left');
//    itemPos.css('text-align', 'center');
    if(move){
	itemPos.addClass('itpos');
    }else{
	itemPos.addClass('endpos');
    }
    
    var itemPosInner = $(document.createElement('div'));
    if(move){
	itemPosInner.addClass('itposinner');
	itemPosInner.append(pos);
    }else{
	if(pos =='start'){
	    itemPosInner.addClass('startposinner');
	}else{
	    itemPosInner.addClass('endposinner');
	}
    }


    itemPos.append(itemPosInner);
    
    var itemName = $(document.createElement('td'));
    itemName.css('width', w2);
    itemName.addClass('itname');
    itemName.append(title);
    if(isnew){
	itemName.append("<font color='red'> (new!)</font>");
    }

    var itemTime = $(document.createElement('td'));
    itemTime.css('width', w3);
    itemTime.append('(' + time + ')');
    if(move){
	itemTime.addClass('ittime');
    }else{
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

    if(!move){
	$(item).addClass('ends');
	$(item).css('cursor', 'default');

	$(item).hover(function(){
	    $(this).css('background', '#FFAB07');
	    $(this).find('.itremove').css('background', 'white');
	}, function(){
	    $(this).css('background', 'white');
	});

    }else{
	$(item).css('cursor', 'move');
	
	$(item).hover(function(){
	    $(this).css('background', '#FFAB07');
	    $(this).find('.itremove').css('background', 'white');
	}, function(){
	    $(this).css('background', 'white');
	});
    }

    $(item).attr('id', id);
    $(item).addClass('itineraryitem')
    $(item).unbind('click');

    if(move){
	$(item).click(function(){
	    viewActivity(getItem(id));
	});
    }else{
	$(item).click(function(){
	    if(id == 'admin_start'){
		editStart();
	    }else{
		editEnd();
	    }
	});
    }

    return item;
}



function removeItem(e){
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
	url: "http://people.csail.mit.edu/hqz/mobi/loadTourStream.php",
	data: ({type: "tour", id: tid}),
	async: false, 
	success: function(obj){
	    if(obj == ""){
	    }else{
		var count = 0;
		for(var i = 0; i < obj.length; i++){
		    if(obj[i].changeInfo == null){
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

function loadTaskState(){
   jQuery.ajax({
      type: "GET",
      // dataType: "json", 
      url: "http://people.csail.mit.edu/hqz/mobi/loadTourTaskState.php",
      data: ({type: "tour", id: tid}),
       async: false, 
      success: function(obj){
	  if(obj == ""){
	  }else{
	      state = eval('(' + obj + ')');
	      stateId = state.stateId;
              state = eval('(' + state.state + ')');

	      loadHostData(state.admin); // requester's stuff
	  }
      }
   });
    return;
}

function locateCategoryIndex(c){
    for(var i = 0; i < categories.length; i++){
	if(categories[i] == c) return i;
    }

    return -1;
}

function loadUserData(){
    // check not null
    if(uid == null) return;
    
    jQuery.ajax({
	type: "GET",
	// dataType: "json", 
	url: "http://people.csail.mit.edu/hqz/mobi/loadTourUserInfo.php",
	data: ({type: "tour", userId: uid, taskId: tid}),
	async: false, 
	success: function(obj){
	    if(obj == ""){
	    }else{
		var userArr = eval('(' + obj + ')');
		numUsers = userArr.length;
		for(var i =0; i < userArr.length; i++){
		    userKeys[userArr[i]['userId']] = userArr[i]['name'];

		    if(userArr[i]['userId'] == uid){
			user = userArr[i];
		    }
		}
	    }
	}
    });
    

}


function showRequestPage(){
    jQuery('#planningWorkspace').hide();
    jQuery('#availableResourcesSpace').show();
}

function goBack(){
    jQuery('#planningWorkspace').show();
    jQuery('#availableResourcesSpace').hide();
}

function activity(name, description, commentary, location, subactivities, duration, categories){
    this.name = name;
    this.description = description;
    this.commentary = commentary;
    this.location = location;
    this.subactivities = subactivities;
    this.duration = duration;
    this.categories = categories;
}

function note(name, description, categories){
    this.name = name;
    this.description = description;
    this.categories = categories;
}

function problemStatement(constraint, predData){
    var statement;
    var unit = constraint.unit;
    if(constraint.value == 1 && constraint.unit =='hours'){
	unit = 'hour';
    }else if(constraint.value == 1 && constraint.unit =='activities'){
	unit = 'activity';
    }
    
    var value = predData.value;
    if(value == 0){
	value = 'no';
    }

    if(constraint.unit == 'hours'){
	statement = 'We need ' + constraint.compare + ' ' + constraint.value + ' ' + unit + ' of ' + constraint.cat + '.' + ' The current itinerary contains ';
	if(value == 'no'){
	    statement += "no " + constraint.cat + '.';
	}else{
	    statement += readMinutes(Math.round(predData.value * 60)) + " of " + constraint.cat + ". ";
	}
    }else {
	statement = 'We need ' + constraint.compare + ' ' + constraint.value + ' ' + constraint.cat + ' ' + unit + '.' +  ' The current itinerary contains ' + value + ' ' + constraint.cat + ' activities. ';
    }

    if(value != 'no'){
	statement += "<br/><br/>The following " + constraint.cat + " activities are in the current itinerary: <br/>";

	for(var i = 0; i < predData.activities.length; i++){
	    statement += (i+1) + ". " + predData.activities[i].name + " &nbsp;[" + readMinutes(predData.activities[i].duration) + "]<br/>";
	}
    }

    return statement;
}


function updateSysStream(){
    $('#sysStreamBody').empty();
    sysStream.length = 0;

    var itineraryItems = [];
    for(var i = 0; i < itinerary.length; i++){
	var si  = getItem(itinerary[i]);
	itineraryItems.push(si);
    }
    // check predicates
    for(var i = 0; i < constraintsFunc.length; i++){
	var predData = constraintsFunc[i](itineraryItems);
	if(!predData.response){
	    // add it to stream
	    var problem = problemStatement(constraints[i], predData);

	    var n = new note(predData.explain, 
			     problem, 
			     ['todo', constraints[i].cat]);
	    var si = new streamitem('todo', n , null);
	    si.id = 'sys_' + i;
	    sysStream.push(si);
	}
    }

    for(var i = 0; i < sysStream.length; i++){
	displayStreamItem('#sysStreamBody', sysStream[i]);
    }
}

function loadStateIntoInterface(){

    jQuery('#stateDisplay').empty();
    jQuery('#availableResources').empty();
    jQuery('#sortable tbody').empty();

    // load start and end location
    displayItineraryItem('#itineraryStart', 'admin_start', false, 'start', 'arrive at ' + start.name, start, minToTime(beginTime), false);
    displayItineraryItem('#itineraryEnd', 'admin_end', false, 'end', 'arrive at ' + end.name, end, minToTime(beginTime), false);


    // set up itinerary
    itinerary = state.itinerary;
    // 
    var itineraryItems = [];
    for(var i = 0; i < itinerary.length; i++){
	var si  = getItem(itinerary[i]);
	itineraryItems.push(si);
    }


    /// display the user stream;
    for(var i = 0; i < userStream.length; i++){
	displayStreamItem('#userStreamBody', userStream[i]);
    }

    for(var i  = itineraryItems.length - 1; i >= 0; i--){
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
    for(var i = 0; i < categories.length; i++){
	tag = "<span style='white-space:no-wrap;'><a class='tagrowitem' href='#' onclick=" + "\"filterOnTag('" + categories[i] + "')\">" + '#' + categories[i] + "</a></span>";
	$('#tagrow').append(tag);// + '&nbsp;&nbsp;');
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

function filterOnTag(tag){
    var user = userStream.filter(function(x){
	return include(x.data.categories, tag);
    });
    var sys = sysStream.filter(function(x){
	return include(x.data.categories, tag);
    });
    
    $('#sysStreamBody').empty();
    $('#userStreamBody').empty();
    
    for(var i = 0; i < sys.length; i++){
	displayStreamItem('#sysStreamBody', sys[i]);
    }

    for(var i = 0; i < user.length; i++){
	displayStreamItem('#userStreamBody', user[i]);
    }

    $('#braintitle').html("results for #" + tag + ":");
    $('#showall').show();
}

function unfilterOnTag(){
    var user = userStream;
    var sys = sysStream;
    
    $('#sysStreamBody').empty();
    $('#userStreamBody').empty();
    
    for(var i = 0; i < sys.length; i++){
	displayStreamItem('#sysStreamBody', sys[i]);
    }

    for(var i = 0; i < user.length; i++){
	displayStreamItem('#userStreamBody', user[i]);
    }
    $('#braintitle').html("<span style='color:#0000CE'>Our brainstream</span><span class='sectioninstruction'>&nbsp;(click for details)</span>");
    $('#showall').hide();
}

function saveEditEnds(){

    var ret = true;
    jQuery.ajax({
	type: "POST",
	url: "http://people.csail.mit.edu/hqz/mobi/submitTourEnds.php",
	async: false,
	data: ({
	    userId : uid,
	    start: JSON.stringify(start),
	    beginTime: beginTime,
	    end: JSON.stringify(end),
	    endTime: endTime,
	    taskId: tid, 
	    startState: stateId,
	    type: "tour"}),
	success: function(msg){
	    if(msg == ""){
		// cannot save it
		alert("It appears that someone else has recently made a change that conflicts with the changes you are trying to save. Please refresh the page before continuing. We apologize for the inconvenience");
		ret = false;
		return;
	    }else {
		disableItSave();
	    }
	}
    });

    closeAdd();
    return ret;
}

function saveItinerary(){

//    state.admin.constraints[1].value = 1;
    // in backend, check to make sure itinerary is legal and consistent
    state.itinerary = itinerary;

    var ret = true;

    jQuery.ajax({
	type: "POST",
	url: "http://people.csail.mit.edu/hqz/mobi/submitTourItinerary.php",
	async: false,
	data: ({
	    userId : uid,
	    answer: JSON.stringify(state),
	    taskId: tid, 
	    startState: stateId,
	    type: "tour"}),
	success: function(msg){
	    if(msg == ""){
		// cannot save it
		alert("It appears that someone else has recently made a change that conflicts with the changes you are trying to save. Please refresh the page before continuing. We apologize for the inconvenience");
		ret = false;
		return;
	    }else {
		disableItSave();
	    }
	}
    });
    return ret;
}

function disableItSave(){

    unsavedChanges = false;
    $('#saveitbutton').disabled = 'true';
  
    $('#saveitbutton').text('drag activities to reorder, click to edit');
    $('#saveitbutton').css('background', '#d3f1f2');
    $('#saveitbutton').css('color', '#0000CE');
    $('#saveitbutton').css('border','1px solid #d3f1f2');
    $('#saveitbutton').unbind();
}


function enableItSave(){
    if(!unsavedChanges){
	unsavedChanges = true;
	$('#saveitbutton').disabled = 'false';
	$('#saveitbutton').text('save itinerary changes!');
	$('#saveitbutton').css('background', '#0000CE');
	$('#saveitbutton').css('color', 'white');
	$('#saveitbutton').css('border','1px outset black');
	$('#saveitbutton').unbind();
	$('#saveitbutton').click(function(){
	    if(checkTimeOut()){
		return; 
	    }
	    var saved = saveItinerary();
	    if(saved){
		alert("Changes to the itinerary have been saved.");
	    }
	});
    }
}

function shortName(sn){
    if(sn == username){
	return "you";
    }
    sn = sn;

    sn = sn.split(' ');
    return sn[0]; // + " " + sn[sn.length-1][0] + ".";
}


function firstName(sn){
    sn = sn.split(' ');
    return sn[0]; // + " " + sn[sn.length-1][0] + ".";
}


function loadHostData(data){
    eventName = data.name;
    description = data.description;
    categories = data.categories;
    constraints = data.constraints;
    start = data.start;
    var creator = data.creator;
    end = data.end;
    beginTime = data.beginTime;
    endTime = data.endTime;

    $("#eventName").html(data.name.replace(/\n/g, "<br/>"));
    $("#description").html("Team " + creator + ",<br/><br/>" + data.description.replace(/\n+$/, '').replace(/\n/g, "<br/>"));
    $('#missiontitle').html($('#eventName').text());
    $('#missiondesc').html($('#description').text());
    
    if(creator == "Pfister" || creator == "AIRG" || creator == "Architecture" || creator == "EconCS" || creator == "Haoqi"){
	$('#addcontrols').html("<button class='addit' onClick='saveAddActivity(false)'>add it to stream & itinerary</button>");
    }

    if(creator == "Pfister"){
	$("#eventName").html("VCG group outing");//data.name.replace(/\n/g, "<br/>"));
	$("#description").html("Team VCG" + ",<br/><br/>" + data.description.replace(/\n+$/, '').replace(/\n/g, "<br/>"));
    }

    displayConstraints();

    // process constraints
    constraintsFunc = [];
    for(var i = 0; i < constraints.length; i++){
	constraintsFunc.push(generatePredicate(constraints[i]));
    }
}


function updateScheduleConstraints(actualend){
    var si;
    var freetime = endTime - actualend;
    var allowedEmpty = .05 * (endTime - beginTime);
//    alert(actualend);
//    alert(freetime);
//    alert(endTime);
    if(freetime > allowedEmpty){// have time left
	var problem = "Based on current start and end times, there is still " + readMinutes(freetime) + ' left empty in the itinerary. The outing can go till ' + minToTime(endTime) + '.';
	// but currently ends at ' + minToTime(actualend);
	var n = new note("Add more things to the itinerary", 
			 problem, 
			 ['todo', 'time']);
	si = new streamitem('todo', n , null);
	si.id = 'sys_have_time_left';
    }else if(freetime < 0){ // no time left
	var problem = 'You can extend the end time, or try reordering activities in the itinerary to save time. You can also edit or remove activities. The outing is currently scheduled to end by ' + minToTime(endTime) + '.';

	var n = new note("The itinerary is over time", 
			 problem, 
			 ['todo', 'time']);
	si = new streamitem('todo', n , null);
	si.id = 'sys_no_time_left';
    }else{
	return;
    }
    displayStreamItem('#sysStreamBody', si);
    
    var checkexist = false;
    for(var i = 0; i < sysStream; i++){
	// check if already in there
	if(sysStream[i].id = 'sys_no_time_left' || 
	   sysStream[i].id == 'sys_have_time_left'){
	    sysStream[i] = si;
	    checkexist = true;
	}
    }
    if(!checkexist){
	sysStream.push(si);
    }
    return;
}


function displaySingleConstraint(i){
    var cat = constraints[i].cat;
    var unit = constraints[i].unit;
    var compare = constraints[i].compare;
    var v = constraints[i].value;
    var str = '';
    if(unit == 'hours'){
	if(v == 1){
	    str = 'spend ' + compare + ' ' + v + ' hour'  + ' ' + 'on ' + "<u>" + cat + "</u>.";
	}else{
   str = 'spend ' + compare + ' ' + v + ' ' + unit + ' ' + 'on ' + "<u>" + cat + "</u>.";
	}
    }else if(unit == 'activities'){
	if(v == 1){
	    str = 'have ' + compare + ' ' + v +  " <u>" + cat + "" + "</u> activity." ;
	}else{
	    str = 'have ' + compare + ' ' + v +  " <u>" + cat + "" + "</u> activities." ;
	}
    }		    
    return str;
}

function displayConstraints(){
    for(var i = 0; i < constraints.length; i++){
	var str = '- ' + displaySingleConstraint(i);
	// spend [compare] [v] [unit] on ['cat']
	// have [compare] [v] ['cat'] activities.
	$('#missionwishes').append(str + '<br/>');
    }
}

function viewHelp(){
    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewMission').hide();
    $('#viewActivity').hide();
    $('#viewHelp').show();    

    $('#box').css('left', '15%');
    $('#box').css('right', '15%');


    $('#overlay').fadeIn('fast',function(){
        $('#box').animate({'top':'20px'},500);
    });
}

function viewMission(){
    // display mission details;
       $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewNote').hide();
    $('#viewHelp').hide();
   $('#viewActivity').hide();


    $('#box').css('left', '30%');
    $('#box').css('right', '30%');



    $('#viewMission').show();



    $('#overlay').fadeIn('fast',function(){
        $('#box').animate({'top':'20px'},500);
    });

}

function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}


function predicateResponse(response, value, activities, explain){
    this.response = response;
    this.value = value;
    this.activities = activities;
    this.explain = explain;
}

function generatePredicate(constraintDesc){
    var cat = constraintDesc.cat;
    var unit = constraintDesc.unit;
    var compare = constraintDesc.compare;
    var v = constraintDesc.value;


    var func =  function(x){
	var total = 0;
	var activities = [];
	for(var i = 0; i < x.length; i++){
	    if(include(x[i].data.categories, cat)){
		activities.push(x[i].data);
		if(unit == 'hours'){
		    total += (parseInt(x[i].data.duration) / 60);
		}else if(unit == 'activities'){
		    total += 1;
		}
	    }
	}
	// now check
	if(compare == 'at most'){
	    if(unit=='hours'){
		return new predicateResponse(total <= v, total, activities, "Too much time on '" + cat + "' in the itinerary");
	    }else if(unit=='activities'){
		return new predicateResponse(total <= v, total, activities, "Have too many '" + cat + "' activities in the itinerary");
	    }
	}else if(compare == 'at least'){
	    if(unit=='hours'){
		return new predicateResponse(total >= v, total, activities, "Add more '" + cat + "' to the itinerary");
	    }else if(unit=='activities'){
		return new predicateResponse(total >= v, total, activities, "Add more '" + cat + "' to the itinerary");
	    }
	}else if(compare == 'exactly'){
	    var explain = "";
	    if(unit=='hours'){
		if(total > v){
		    explain = "Too much time on '" + cat + "' in the itinerary";
		}else if(total < v){
		    explain = "Add more '" + cat + "' to the itinerary";
		}
		return new predicateResponse(total == v, total, activities, explain);
	    }else if(unit=='activities'){
		if(total > v){
		    explain = "Have too many '" + cat + "' activities in the itinerary";
		}else if(total < v){
		    explain = "Add more '" + cat + "' to the itinerary";
		}
		return new predicateResponse(total == v, total, activities, explain);
	    }
	}
    }
    return func;
}



function readUrlParameters(){
   var params = getURLParams();		       
   if(params.tid){
     tid = params.tid;
   }

    if(params.uid){
	uid = params.uid;
    }
    showMobi();
  return;
}

function showMobi(){
    jQuery('#mobi-content').css('display', 'inline');
}


function displayNeedLink(){
    jQuery("#needLink").css('display', 'block');
}

function unescapeURL(s) {
    return decodeURIComponent(s.replace(/\+/g, "%20"))
}


function campuslocation(vlabel, data){
    this.label = vlabel;
    this.data = data;
}

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

function readyLocations(){
    // // get Harvard locations..
    // $.ajax({
    // 	url: "http://maps.cs50.net/api/1.2/buildings?output=jsonp",
    // 	dataType: "jsonp",
    // 	success: function( data ) {
    // 	    for(var i = 0; i < data.length; i++){
    // 		campuslocations.push(new campuslocation(data[i].name, data[i]));
    // 	    }
    // 	}
    // });
}


var fixHelper = function(e, ui) {
       ui.children().each(function() {
       $(this).width($(this).width());
    });
    return ui;
};

function updateItineraryDisplay(){
    // update the system generated displays in stream
    updateSysStream();

    for(var i = 0; i < itinerary.length; i++){
	if(i+1 != wayhash[itinerary[i]].pos){
	    wayhash[itinerary[i]].pos = i+1;
	    updatePinNumber(wayhash[itinerary[i]].pin, i+1);
	}
    }
    
    // get the locations of all itinerary items..
    var coords = [];
    for(var i = 0; i < itinerary.length; i++){
	coords.push(wayhash[itinerary[i]].ll);
    }

    // give numbers to 'em badges in the stream
    for(var i = 0; i < itinerary.length; i++){
	$('#ss_' + itinerary[i]).empty();
	$('#ss_' + itinerary[i]).append(i+1);
    }
    // update the route
    GetRoute([startPin.GetPoints()[0]].concat(coords, [endPin.GetPoints()[0]]));

    var i = 1;
     $('.itposinner').each(function(){
     	 $(this).html(i);
     	 i++;
     });
    
}

$(document).ready(function(jQuery) {



    sessionStart = (new Date()).getTime();

//    readyLocations();
    readyAdd();

    jQuery("#availableResourcesSpace").hide();

    jQuery( "#itinerary").sortable(
	{
	    //items: "tr:not(.ends)", 
	 scroll: true,
	    start: function(e, ui) {
		$('#' + ui.item.attr('id')).unbind('click');
	    },
	    stop: function(e, ui) {
		setTimeout(function() {
		    $('#' + ui.item.attr('id')).click(function (){
//			alert("calling from sortable stop");
			viewActivity(getItem(ui.item.attr('id')));
		    });
		}, 300);
	    },
	 update: function(event, ui) {
	     itinerary = $("#itinerary").sortable('toArray');
	     saveItinerary();
//	     enableItSave();
	     updateItineraryDisplay();
	 },
	    //helper: fixHelper});
	});
    jQuery( "#sortable").disableSelection();
    
    readUrlParameters(); // get userId and taskId
    loadTaskState(); // Load where we are current at with task
    loadUserData();
    initMap();


    loadStream(); // load all the stream info
    loadStateIntoInterface(); // now load it all into interface.
    disableItSave();

    $('#box').css('left', '15%');
    $('#box').css('right', '15%');

//    mapCenter = new VELatLong(start.lat, start.long);
  

    GetNewActMap();
    readySearchBox();
    
    $(window).resize(function(){
	/// HACK TO FIX MAP RESIZE PROBLEMS
	if(map != null){
	    map.Resize(); 
	}
	if(newactmap != null){
	//    newactmap.Resize();
	}
	delay(function(){
	    if(map != null){
		map.SetCenter(map.GetCenter());  
	    }         
	    if(newactmap != null){
	//	newactmap.SetCenter(newactmap.GetCenter());
	    }
	}, 1000);
    });
    

    /// HACK TO FIX IE SCROLL PROBLEM
    if ( $.browser.msie ) {
	/// nevermind, just tell the person they should use something else
	alert("We have noticed that you are using Internet Explorer as your browser. Some of the functionalities of this site may not work well in Internet Explorer, so we recommend you to use any other popular browser, e.g., Firefox, Safari, or Chrome. Sorry for the inconvenience.");
	// make stream not scroll
	$('#brainstream').css('overflow', 'hidden');
	// make left1 (stream containing section) scrool
	$('#left1').css('overflow', 'auto');
    }


    $.ui.autocomplete.prototype._renderItem = function( ul, item) {
        var re = new RegExp("^" + this.term) ;
        var t = item.label.replace(re,"<span style='font-weight:bold;color:Blue;'>" + 
				   this.term + 
				   "</span>");
        return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( "<a>" + item.value + "</a>" )
            .appendTo( ul );
    };
    
});

var delay = (function(){
    var timer = 0;
    return function(callback, ms){
	clearTimeout (timer);
	timer = setTimeout(callback, ms);
    };
})();






if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
	for (var i = (start || 0); i < this.length; i++) {
	    if (this[i] == obj) {
		return i;
	    }
	}
	return -1;
    }
}

if (!Array.prototype.filter)
{
    Array.prototype.filter = function(fun /*, thisp*/)
    {
	var len = this.length;
	if (typeof fun != "function")
	    throw new TypeError();

	var res = new Array();
	var thisp = arguments[1];
	for (var i = 0; i < len; i++)
	{
	    if (i in this)
	    {
		var val = this[i]; // in case fun mutates this
		if (fun.call(thisp, val, i, this))
		    res.push(val);
	    }
	}

	return res;
    };
}

if (!Array.prototype.map)
    {
	Array.prototype.map = function(fun /*, thisp*/)
	{
	    var len = this.length;
	    if (typeof fun != "function")
		throw new TypeError();

	    var res = new Array(len);
	    var thisp = arguments[1];
	    for (var i = 0; i < len; i++)
		{
		    if (i in this)
			res[i] = fun.call(thisp, this[i], i, this);
		}
	    return res;
	};
    }
