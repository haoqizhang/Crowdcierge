var map = null;
var reviewMap = null;
var collectedConstraints = false;
var entry = null;
var currentPage = 1;
var numTags = 0;
var mapCenter = null;
var donearby = true;
var serverUrl = "http://people.csail.mit.edu/hqz/mobi/";
var potluck = false;
var startPin = null;
var endPin = null;
var findLayer = null;
var pinMoved = false;
var tid;
var uid = null;
var citySelected = false;
var lastSearch = null; 

      function GetReviewMap()
      {
	  reviewMap = new VEMap('reviewMapDiv');
	  var mapOptions = new VEMapOptions();
	  mapOptions.DashboardColor = 'black';
	  mapOptions.UseEnhancedRoadStyle = true;


	  reviewMap.SetDashboardSize(VEDashboardSize.Tiny);
	  reviewMap.HideScalebar();

	  reviewMap.LoadMap(new VELatLong(entry.start.lat, entry.start.long), 12, 'r', false, VEMapMode.Mode2D, true, 0, mapOptions);
	  var shape = new VEShape(VEShapeType.Pushpin, startPin.GetPoints()[0]);
	  shape.SetTitle(startPin.GetTitle());
	  shape.SetCustomIcon("pin-start.png");
	  shape.draggable = false;
	  
	  reviewMap.AddShape(shape);	  
      }   


      function GetMap()
      {
	  map = new VEMap('mapDiv');
	  var mapOptions = new VEMapOptions();
	  mapOptions.DashboardColor = 'black';
  	  mapOptions.UseEnhancedRoadStyle = true;
	  map.LoadMap(mapCenter, 14, 'r', false, VEMapMode.Mode2D, true, 0, mapOptions);
	  
	  // Layer for find
	  findLayer = new VEShapeLayer();
	  findLayer.SetTitle("findLayer");
       
	  map.AddShapeLayer(findLayer);


      }   

      function AddPushpin(ll,title, desc, canDrag, custom)
      {
	  if(ll == null) ll = map.GetCenter();
	  
	  var shape = new VEShape(VEShapeType.Pushpin, ll);
	  shape.SetTitle(title);
	  shape.SetDescription(desc);
	  if(custom != null){
	      shape.SetCustomIcon(custom);
	  }
	  
	  map.AddShape(shape);
	  shape.Draggable = canDrag;
	  return shape;
      }



function processFind(a,b,c,d,e){

    if(b!= null && b.length > 1){
	var shape;
	var numResults = a.GetShapeCount();

	for (var i = 0; i < a.GetShapeCount(); i++) {
	    shape = a.GetShapeByIndex(i);
	    shape.SetCustomIcon("<img src ='pin2.gif'>"); 
	    shape.SetDescription(shape.GetDescription() + "<br/><br/><a href='#' onclick='moveact(" + i +  ")' style='color:#0000CE'>Move location pin here</a>");
	}
    }

}



function moveact(i){
    pinMoved = true;
    var shape = findLayer.GetShapeByIndex(i);
    var overlap = false;
    e = startPin;
    e.SetTitle(shape.GetTitle());
    e.SetPoints(shape.GetPoints());
    map.SetCenter(shape.GetPoints()[0]);
}



      
      function initTour(){
	  
      $("#tour").show();

      
      GetMap();
      startPin = AddPushpin(null, 'start location', 'start pushpin', true, "pin-start.png");
      startPin.onenddrag = OnTop('#startLocation');

      //      endPin = AddPushpin(null, 'end location', 'end pushpin', true, "pin-end.png");
    
  //    endPin.onenddrag = OnTop('#endLocation');
      }


function OnTop(name){
    return function RightOnTop(e){
	// check overlap with objects from search nearby
	var shape;
	var numResults = findLayer.GetShapeCount();
	var overlap = false;
	pinMoved = true;
	for (var i = 0; i < numResults; i++) {
	    shape = findLayer.GetShapeByIndex(i);
	    var lngdiff = Math.abs(shape.GetPoints()[0].Latitude - e.LatLong.Latitude);
	    var latdiff = Math.abs(shape.GetPoints()[0].Longitude - e.LatLong.Longitude);
	    
	    if(lngdiff < 0.0004 && latdiff < 0.0004){
		// populate title
		e.Shape.SetTitle(shape.GetTitle());
		e.Shape.SetPoints(shape.GetPoints());
//		$(name).val(shape.GetTitle());
	    }
	}
    }
}

function setEndToStart(){
    var startTitle = $('#startLocation').val();
//    endPin.SetTitle(startTitle);
//    endPin.SetPoints(startPin.GetPoints());
//    $('#endLocation').val(startTitle);
}

function slocation(name, lat, long){
    this.name = name;
    this.lat = lat;
    this.long = long;
}

function getLocation(pin, name){
    var loc = pin.GetPoints()[0];
    return new slocation($(name).val(), loc.Latitude, loc.Longitude);
}

function getConstraints(field, name){
    var compares = new Array();
    var key = "#" + field + " :input[name=\"" + 'compare' + name + "\"]"; 
    var compareInputs = $(key);
    compareInputs.each(function(){
	 //   if($(this).val() != ""){
		compares.push($(this).val());
	 //   }
	});

    var units = new Array();
    var key = "#" + field + " :input[name=\"" + 'unit' + name + "\"]"; 
    var unitInputs = $(key);
    unitInputs.each(function(){
	  //  if($(this).val() != ""){
		units.push($(this).val());
	  //  }
	});


    var categories = new Array();
    var key = "#" + field + " :input[name=\"" + 'category' + name + "\"]"; 
    var categoryInputs = $(key);
    categoryInputs.each(function(){
	  //  if($(this).val() != ""){
		categories.push($(this).val());
	   // }
	});



    var vals = new Array();
    var key = "#" + field + " :input[name=\"" + 'val' + name + "\"]"; 
    var valInputs = $(key);
    valInputs.each(function(){
	  //  if($(this).val() != ""){
		vals.push($(this).val());
	   // }
	});

   // put it all together
 var inputsList = [];
 for(var i = 0; i < vals.length; i++){
     if(categories[i] == "" || units[i] == "" || compares[i] == "" || vals[i] == ""){
	 // empty field not legal
	 continue;
     }
     // check values are numbers to ensure legal
     if(!isNumber(vals[i])){
	 return -1;
     }
     if(units[i] == 'hours'){
	 inputsList.push(new constraint(categories[i], units[i], compares[i], parseFloat(vals[i])));
     }else if(units[i] == 'activities'){
	 inputsList.push(new constraint(categories[i], units[i], compares[i], parseInt(vals[i])));
     }
 }					     
    return inputsList;
}
      

function Answer(){
}

function gatherSubmit(){
    var answer = new Answer();
    answer.activity = $('#city').val(); //$('#tour_activity').val();
    answer.description = $('#tour_description').val();
    answer.categories = getSet('tour_categories', 'categorySet');
    answer.constraints = collectedConstraints;
    answer.start =  getLocation(startPin, '#startLocation');
    answer.transit = $('#transit').val();
//    answer.end = getLocation(endPin, '#endLocation');
    answer.beginTime = $('#startTime').val();
    answer.endTime = $('#endTime').val();
    answer.creator = $('#creator').val();
    answer.creatorEmail =  $('#creatoremail').val();
    answer.type = "both";
    
    return answer;
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function submitTask(){
    var answer = entry;//gatherSubmit();

      $.ajax({
	      type: "POST",
		  url: serverUrl + "createStudyTourTask.php",
	  async: false,
		  data: ({
		      zoom: 14,
		      uid: uid,
		      activity : "Visiting " + answer.activity,
		              creator : answer.creator,
		              email : answer.creatorEmail, 
			      description : answer.description, 
			      categories : JSON.stringify(answer.categories),
			      constraints: JSON.stringify(answer.constraints),
			      start: JSON.stringify(answer.start),
			      end: JSON.stringify(answer.start),
			      beginTime: answer.beginTime,
			      endTime: answer.endTime,
     		              transit: answer.transit, 
			      type: answer.type}),
	  
		success: function(msg){
		   // alert(msg);
//		alert("You have created the task!" + msg);
		    nextPage();
		// load the task
//		updateTasklist();
	    }
	});
    return;
}

function submitUpdateTask(){
    $.ajax({
	    type: "POST",
		url: serverUrl + "updateTask.php",
		data: ({id: tid, 
			activity : $('#tour_activity').val(),
			    description : $('#tour_description').val(),
			    categories : getSet('tour_categories', 'categorySet'),
			    verbal: getSet('tour_verbal', 'preferenceSet'),
			    type: "tour"}),
		success: function(msg){
		//		alert(msg);
		alert("Your have updated the task!");
		// load the task
		updateTasklist();
	    }
	});
    return;
}

function getSet(field, name){
    var inputsList = new Array();
    var key = "#" + field + " :input[name=\"" + name + "\"]"; 
    //    alert(key);
    var inputs = $(key);
    inputs.each(function(){
	    if($(this).val() != ""){
		inputsList.push($(this).val());
	    }
	});
    return inputsList;
}

function updateTasklist(){
     $.ajax({
      type: "GET",
      url: serverUrl + "showTourTasks.php",
      data: ({type: "tour"}),
      success: function(table){
//           alert(table);
          $('#tasklist').html(table);
      }
      });
    return;
}

function removeTask(taskId){
    var r=confirm("Are you sure you want to delete this task?");
    if (r==true)
	{
	    $.ajax({
		    type: "POST",
			url: serverUrl + "deleteTourTask.php",
			data: ({type: "tour", id: taskId}),
			success: function(msg){
			//           alert(msg);
			alert("The task is deleted!");
			updateTasklist();
		    }});
	    return;
	    
	}
    else
	{
	}
}

function editTask(taskId){
    // store the task id;
    tid = taskId;

     $.ajax({
      type: "GET",
      url: serverUrl + "loadTaskInfo.php", 
      data: ({type: "tour", id: taskId}),
      success: function(obj){
          // assume json object we can work with
//alert(obj);
          var info = eval('(' + obj + ')');
            loadEditInterface(info);
      }
      });
    return;
}

function loadEditInterface(info){
    $('#createoredit').html("Edit an existing event");
    $('#tour_activity').val(info.name);
    $('#tour_description').val(info.description);
    $('#tour_categories').empty();
    var cat = eval('(' + info.categories + ')');
    for(var i = 0; i < cat.length; i++){
	createField('tour_categories', 'categorySet', cat[i], 60);
    }

    $('#tour_verbal').empty();
    var pref = eval('(' + info.constraints_verbal + ')');
    for(var i = 0; i < pref.length; i++){
	createField('tour_verbal', 'preferenceSet', pref[i], 100);
    }

    // make it an update task
    $("#submitter").unbind();
    $("#submitter").click(function() {submitUpdateTask(); return false;});
}


function createField(field, name, val, size){
var div = $(document.createElement('div'));
    div.attr('class', 'contain' + name);
 var c = "<input type=\"text\" name=\"" + name + "\" value=\"" + val +  "\" onkeyup=\"refreshOptions(this)\" size=\"" + size + "\"/>&nbsp; <img src='exit.png' width='11' style='vertical-align:middle;margin-right:20px' onclick='removeItem(this)'>";

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


function removeItem(e){
    var index;
    var ediv = jQuery(e).closest('div');
    index = $('.containcategorySet').index(ediv);
    var v = $($('input[name="categorySet"]')[index]).val();

    var reqs = $('select[name="categorypreferenceSet"]');
    ediv.remove();
    reqs.each(function(){
	if($(this).val() == v){
	    // these requirements should disappear
	    removeRequirement($(this));
	}
    });
    
    removeOption(v);
}

function removeRequirement(e){
    var index;
    var ediv = jQuery(e).closest('div');
    index = jQuery('.requirementSet').index(ediv); 
    ediv.remove();
}

function createSelectField(name, opts, w){
    var s = $(document.createElement('select'));
    s.attr('name', name);
    s.css('width', w);
    for(var i = 0; i < opts.length; i++){
	var o = $(document.createElement('option'));
	o.val(opts[i]);
	o.text(opts[i]);
	s.append(o);
    }
    return s;
}

function createConstraintField(field, name, val, size){
var container = '#' + field;
    var fname = $(document.createElement('div'));
    fname.attr('class', 'contain' + name);
    $(fname).append("&nbsp;&nbsp;&nbsp;I want ");
    $(fname).append(createSelectField('compare' + name, ['at most', 'at least', 'exactly'], '80px'));
    $(fname).append("&nbsp;");
 var ix = $(document.createElement('input'));
 ix.attr('name', 'val' + name);	
    ix.attr('type', 'text');    
    ix.attr('size', '10');
 $(fname).append(ix);
    $(fname).append("&nbsp;");
    $(fname).append(createSelectField('unit' + name, ['hours', 'activities'], '80px'));
 $(fname).append(' on ');
    $(fname).append(createSelectField('category' + name, getCategories(), '200px'));
    $(fname).append("&nbsp; <img src='exit.png' width='11' style='vertical-align:middle;margin-right:20px' onclick='removeRequirement(this)'>");
    $(fname).append("<br/>"); 
    $(container).append(fname);
}

function getCategories(){
    var inputsList = new Array();
    var inputs = $('#tour_categories' + ' :input[name="categorySet"]');
    inputs.each(function(){
//	if($(this).val() != ""){
	    inputsList.push($(this).val());	    
//	}
	});
    return inputsList;
}

function removeOption(n){
    $('select[name="categorypreferenceSet"] > option[value="' + n + '"]').remove();
}

function refreshOptions(e){
    var count = $('#tour_categories' + ' :input[name="categorySet"]').index(e);

    $('select[name="categorypreferenceSet"]').each(function(){
	$($(this).children()[count]).val($(e).val());
	$($(this).children()[count]).text($(e).val());
    });
}



function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

function constraint(category, unit, compare, value){
    this.cat = category;
    this.unit =  unit;
    this.compare = compare;
    this.value = value;
}

function generatePredicate(constraintDesc){
    var cat = constraintDesc.cat;
    var unit = constraintDesc.unit;
    var compare = constraintDesc.compare;
    var v = constraintDesc.value;
    return function(x){
	var total = 0;
	for(var i = 0; i < x.length; i++){
	    if(include(x.categories, cat)){
		if(unit == 'hours'){
		    total += x.duration;
		}else if(unit == 'activities'){
		    total += 1;
		}
	    }
	}
	// now check
	if(compare == 'at most'){
	    return total <= v;
	}else if(compare == 'at least'){
	    return total >= v;
	}else if(compare == 'exactly'){
	    return total == v;
	}
    }
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

function searchKeyPress(evt){
    var evtobj = evt;
    if((evtobj.keyCode && evtobj.keyCode == 13)){//|| (evtobj.which && evtobj.which == 13) ){
	document.getElementById('find').click();
	return true;
    }

    return true;
}

function setTimeField(name, s, e){
    for(var i = s; i < e; i++){
	for(var j = 0; j <= 45; j +=30){
	    var o = $(document.createElement('option'));
	    o.val(i*60 + j);
	    var is = i;
	    var js = j;

	    if(j == 0) js = '00';
	    if(i < 12){
		o.text(is + ":" + js + " AM");
	    }else if(i>=24){
		o.text(is%24 + ":" + js + " AM (+1)");			    
	    }else {
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

function readUrlParameters(){
   var params = getURLParams();

   if(params.uid){
	uid = params.uid;
   }
  return;
}

function unescapeURL(s) {
    return decodeURIComponent(s.replace(/\+/g, "%20"))
}


function checkSubject(){
    if(uid == null){
	$('.page').html("It appears that our system does not recognize you. Please check that you have correctly entered the link we'd sent to you via email, and contact us via email if the issue remains.");
	$('.topspan').html("");
	return;
    }

   jQuery.ajax({
      type: "GET",
      dataType: "json", 
      url: "http://people.csail.mit.edu/hqz/mobi/checkSubject.php",
      data: ({id: uid}),
      async: false, 
      success: function(obj){
	  if(obj == null){
	      $('.page').html("It appears that our system does not recognize you. Please check that you have correctly entered the link we'd sent to you via email, and contact us via email if the issue remains.");
	      $('.topspan').html("");
	      return;
	  }

	  if(obj.tid == null){
	       $('#creator').val(obj.name);
	       $('#creatoremail').val(obj.email);
	  }else{
	      // already created
	      $('.page').html("It appears that you have already signed up for mobi. We are resending an email with your personal links in case you forgot them!");
	      $('.topspan').html("");
	      resendEmail(obj.name, obj.email, obj.tid);
	  }
	   }
       });
    return;
}


function resendEmail(name, email, taskId){



}

function setLocation(q){
    var key = "AmoK7LJck9Ce_JO_n_NAiDlRv88YZROwdvPzWdLi57iP3XQeGon28HJVdnHsUSkp";
     $.ajax({
	    url: "http://dev.virtualearth.net/REST/v1/Locations",
	    dataType: "jsonp",
	    data: {
		key: key,
		q: q
	    },
	    jsonp: "jsonp",
	    success: function (data) {
		if(data && data.resourceSets){
		    var lat = data.resourceSets[0].resources[0].point.coordinates[0];
		    var lng = data.resourceSets[0].resources[0].point.coordinates[1];
		    mapCenter = new VELatLong(lat, lng);

		}
	    }
	});
}

var delay = (function(){
    var timer = 0;
    return function(callback, ms){
	clearTimeout (timer);
	timer = setTimeout(callback, ms);
    };
})();


function previousPage(){

    if(currentPage == 5){//review
	$('#review').hide();
	$('#page4').show();
    }else if(currentPage == 4){
	$('#page4').hide();
	$('#page3').show();
    }else if(currentPage == 3){
	$('#page3').hide();
	$('#page2').show();
    }else if(currentPage == 2){
	$('#page2').hide();
	$('#page1').show();
    }else{
	return;
    }
    currentPage--;
}

function nextPage(){

    if(currentPage == 1){
	if($('#consent').attr('checked')){
	    if(citySelected){			    
		// go to page 2
		$('#page1').hide();
		$('#page2').show();			    
		initTour();
		map.Resize();
		map.SetZoomLevel(12);
		currentPage = 2;
	    }else{
		alert("Please select one of the cities listed (you may have just been typing faster than the box can fill). If the city you are visiting is not listed, please contact us.");
		return;
	    }
	}else{			    
	    alert("Please review the research study information and click the checkbox to express your consent if you wish to continue.");
	    return;
	} 
    }else if(currentPage == 2){
	if($('#startLocation').val() == ""){
	    alert("Please let us know where you will be staying. If you don't know yet, just enter any location (e.g., \"downtown\") and we will start planning your day from there.")
	    return;
	}
	
	if(parseInt($('#endTime').val()) - parseInt($('#startTime').val()) <= 0){
	    alert("It appears that the end time for the day is set before the time the day starts. Please revise your start and end times before proceeding.");
	    return;
	}

	if($('#transit').val()==""){
	    alert("Please let us know whether you will be driving or taking public transit.");
	    return;
	}
	if(!pinMoved){
	    var answer = confirm("It seems like you didn't move the location pin. Are you sure you want to continue?");
	    if (answer){
	    }
	    else{
		return;
	    }
	}
	// go to page 3
	$('#page2').hide();
	$('#page3').show();
	currentPage = 3; 
    }else if(currentPage == 3){
	if($('#tour_description').val() == ''){
	    alert("Please enter a description of what you'd like to do for the day before continuing.");
	    return;
	}
	currentPage = 4;
	$('#page3').hide();
	$('#page4').show();
    }else if(currentPage == 4){
	// make sure things are numeric
	// var vals = new Array();
	// var key = "#" + field + " :input[name=\"" + 'val' + name + "\"]"; 
	// var valInputs = $(key);
	// valInputs.each(function(){
	//     if($(this).val() != ""){
	// 	vals.push($(this).val());
	//     }
	// });
	collectedConstraints = getConstraints('tour_verbal', 'preferenceSet');
	if(collectedConstraints == -1){
	    alert("One of your requirements contains a non-numeric entry for the number of hours or activities. Please fix this before continuing.");
	    return;
	}
	$('#page4').hide();
	$('#reviewCategories').html("");
	$('#reviewConstraints').html("");
	
	$('#review').show();
	currentPage = 5;
	entry = gatherSubmit();
	fillReview();
    }else if(currentPage == 5){
	$('#review').hide();
	$('#finishEmail').html(entry.creatorEmail);
	$('#finished').show();
	currentPage = 6;
    }
    if(currentPage != 6){
	$('#stepcount').html("Step " + currentPage + " of 5");
    }else{
	$('#stepcount').html("");
    }
}

function displaySingleConstraint(constraints, i){
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


function displayConstraints(constraints){
    for(var i = 0; i < constraints.length; i++){
	var str = '- ' + displaySingleConstraint(constraints, i);
	// spend [compare] [v] [unit] on ['cat']
	// have [compare] [v] ['cat'] activities.
	$('#reviewConstraints').append(str + '<br/>');
    }
    if(constraints.length == 0){
	$('#reviewConstraints').html("- Plan a fun outing that you'd personally love to go on!");
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

function fillReview(){
//    alert(JSON.stringify(entry));
    $('#reviewCity').html(entry.activity);
    $('#reviewDuration').html(minToTime(entry.beginTime) + " to " + minToTime(entry.endTime) + " (" + 
			      readMinutes(parseInt(entry.endTime) - parseInt(entry.beginTime)) + ")");
    $('#reviewStartLocation').html(entry.start.name);
    if($('#transit').val() == "true"){
	$('#reviewTransit').html("By public transit");
    }else{
	$('#reviewTransit').html("By car");	
    }

    GetReviewMap();
    $('#reviewDescription').html(entry.description);
    for(var i = 0; i < entry.categories.length - 1; i++){
	$('#reviewCategories').append(entry.categories[i] + ", ");
    }
    $('#reviewCategories').append(entry.categories[entry.categories.length -1]);    
    displayConstraints(entry.constraints);
}

function minToTime(time){
    if(time > 1440) time -= 1440;
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


function autoNearby() {
    if(!donearby){
	donearby = true;
	return;
    }
    // puts nearby on new activity map
    var txt = $('#startLocation').val();
    if(txt == lastSearch) {
	return;
    }else{
	lastSearch = txt;
    }

    findLayer.DeleteAllShapes();
    try
    {
	map.Find(txt, null, null, findLayer,0,10,true,true,true,true, processFind);
    }
    catch(e){
	alert(e.message);
    }
}

$(document).ready(function(){
    
    $('#page2').hide();
    $('#page3').hide();
    $('#page4').hide();    
    $('#review').hide();
    $('#finished').hide();


    var ac_config = {
	source: "../checkCity.php",
	select: function(event, ui){
	    var cs = ui.item.city + ", " + ui.item.state;
	    $("#city").val(cs);
	    citySelected = true;
	    // see http://msdn.microsoft.com/en-us/library/ff701711.aspx
	    setLocation(cs);
	},
	minLength:0
    };
    $("#city").autocomplete(ac_config);
    
    readUrlParameters();
    
    setTimeField('#startTime', 6, 24);
    setTimeField('#endTime', 6, 30);
    
    checkSubject();
    
    //	initTour();
    $("#submitter").click(function() {submitTask(); return false;});
    //      updateTasklist();
});


