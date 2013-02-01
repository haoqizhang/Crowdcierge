function g(a){var b=typeof a;if(b=="object")if(a){if(a instanceof Array||!(a instanceof Object)&&Object.prototype.toString.call(a)=="[object Array]"||typeof a.length=="number"&&typeof a.splice!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("splice"))return"array";if(!(a instanceof Object)&&(Object.prototype.toString.call(a)=="[object Function]"||typeof a.call!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("call")))return"function"}else return"null";
else if(b=="function"&&typeof a.call=="undefined")return"object";return b};function h(a){a=String(a);var b;b=/^\s*$/.test(a)?false:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,""));if(b)try{return eval("("+a+")")}catch(c){}throw Error("Invalid JSON string: "+a);}function i(a){var b=[];j(new k,a,b);return b.join("")}function k(){}
function j(a,b,c){switch(typeof b){case "string":l(a,b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(b==null){c.push("null");break}if(g(b)=="array"){var f=b.length;c.push("[");for(var d="",e=0;e<f;e++){c.push(d);j(a,b[e],c);d=","}c.push("]");break}c.push("{");f="";for(d in b)if(b.hasOwnProperty(d)){e=b[d];if(typeof e!="function"){c.push(f);l(a,d,c);c.push(":");j(a,e,c);f=","}}c.push("}");break;
case "function":break;default:throw Error("Unknown type: "+typeof b);}}var m={'"':'\\"',"\\":"\\\\","/":"\\/","\u0008":"\\b","\u000c":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\u000b":"\\u000b"},n=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;function l(a,b,c){c.push('"',b.replace(n,function(f){if(f in m)return m[f];var d=f.charCodeAt(0),e="\\u";if(d<16)e+="000";else if(d<256)e+="00";else if(d<4096)e+="0";return m[f]=e+d.toString(16)}),'"')};window.JSON||(window.JSON={});if(typeof window.JSON.serialize!=="function")window.JSON.serialize=i;if(typeof window.JSON.parse!=="function")window.JSON.parse=h;

var activity;
var description;
var categories;
var verbal;
var tid = '1eb150a5c7a43a96f76c4f94fc940311';
var uid = null; // TODO: get user id from parameters
var username = null;
var email = null;
var requestId = null;
var requestEmail = null;
var state; // state of the world
var preferenceOrdering = null; // ordering on previous preferences
var userKeys = [];//todo, more efficient
var planByCategory = true;

// TODO: load work others have done so far
function showProgress(){
     $.ajax({
      type: "GET",
      url: "http://people.csail.mit.edu/hqz/mobi/showProgress.php",
      data: ({type: "potluck", id: tid}),
      success: function(table){
          // assume json object we can work with
		 //alert(obj);
          $('#tasklist').html(table);
	     }
	 });
    return;
}


// Deprecated-- loaded from the state
// // load category and general task info from database
// function loadTaskInfo(){
//      $.ajax({
//       type: "GET",
//       url: "http://people.csail.mit.edu/hqz/mobi/loadTaskInfo.php",
//       data: ({type: "potluck", id: tid}),
//       success: function(obj){
//           // assume json object we can work with
// //alert(obj);
//           var info = eval('(' + obj + ')');
//             loadData(info);
//             loadInterface();
//       }
//       });
//     return;
// }

function loadTaskState(){
   $.ajax({
      type: "GET",
      url: "http://people.csail.mit.edu/hqz/mobi/loadTaskState.php",
      data: ({type: "potluck", id: tid}),
      success: function(obj){
      if(obj == ""){
        // nothing to load
      }else{
	  alert(obj);	  
          // read in the state
	  
          state = eval('(' + obj + ')');

	  state = eval('(' + rtrim(state.state) + ')');

	  alert(JSON.stringify(state));

	  loadHostData(state.admin); // host's stuff
	  loadInterface(); 
          loadStateIntoInterface();
	  loadUserData();
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

    // find data on this particular user from 
    if(typeof userKeys[uid] == "undefined"){
	return;
    }

    var userData = state.users[userKeys[uid]];
    if (typeof userData  == "undefined") {
	return;
    }

    // since user has been here before, load the data he had originally entered
    $('#preferences').empty();
    $('#choices').empty();

    for(var i = 0; i < userData.choices.length; i++){
	createChoiceField('choices', userData.choices[i].description, locateCategoryIndex(userData.choices[i].type), userData.choices[i].selected, true);
    }

    for(var i = 0; i < userData.preferences.length; i++){
	createField('preferences', 'preferenceSet', userData.preferences[i].description, 400, true);
    }
}


function loadStateIntoInterface(){

  $('#stateDisplay').empty();
  $('#availableResources').empty();
  $('#peoplesPreferences').empty();
  $('#sortable').empty();

    // load user keys
    userKeys = [];
    for(var i = 0; i < state.users.length; i++){
	userKeys[state.users[i].userId] = i;
    }

// load the menu by catergory
    var menu = "<b>Menu</b><br/>";
    if(!planByCategory){
     for(var i = 0; i < state.users.length; i++){
 	for(var j = 0; j < state.users[i].choices.length; j++){
 	    if(state.users[i].choices[j].selected){
		menu += state.users[i].choices[j].description + " (" + state.users[i].choices[j].type + ") -- " + state.users[i].name + "<br/>";
 	    }
 	}
     }
    }else{
	// or by type of food:
	for(var k = 0; k < categories.length; k++){
	    menu += "<div id='menuCategory" + k + "'><u>" + categories[k] + "</u><br/>";
	    for(var i = 0; i < state.users.length; i++){
		for(var j = 0; j < state.users[i].choices.length; j++){
		    if(state.users[i].choices[j].type == categories[k] && state.users[i].choices[j].selected){
			// 	    if(state.users[i].choices[j].selected){
			menu += state.users[i].choices[j].description + "-- " + state.users[i].name + "<br/>";
		    }
		}
	    }
	    
	    menu += "</div><br/>";
	}
    }

   // load resources
    var availableResources = "<br/><u>Things people may be willing to bring instead:</u><br/>";
    for(var i = 0; i < state.users.length; i++){
	for(var j = 0; j < state.users[i].choices.length; j++){
	    if(!state.users[i].choices[j].selected){
		availableResources += "<button onClick=\"request(" + i + "," + j + ")\">request this!</button>" + state.users[i].choices[j].description + " (" + state.users[i].choices[j].type + ") -- " + state.users[i].name + "<br/>";
	    }
	}
    }


    // load the constraints
    var peoplesPreferences = "<br/><u>People's preferences (you can drag them to put the most important ones on top!)</u><br/>";
    for(var i = 0; i < state.preferenceOrdering.length; i++){
	var color = (i / (state.preferenceOrdering.length - 1.0)) * 200;
 	var pl = state.users[userKeys[state.preferenceOrdering[i].userId]].preferences;
 	for(var j = 0; j < pl.length; j++){
	    if(state.preferenceOrdering[i].id == pl[j].id){
		var preferenceInfo = pl[j].description + " -- " + 
 		    state.users[userKeys[state.preferenceOrdering[i].userId]].name + "<br/>";
		// 		peoplesPreferences += preferenceInfo;
		// add it to sortable
		var e = "<input type=\"checkbox\" name=\"choiceSelected\"></input>";

		$('#sortable').append("<li id='po" + i +"' class=\"ui-state-default\"><div style='color:rgb(" + color + "," + color + "," + color + ");border:2px solid;margin:2px;padding:2px;width:400px'>" + preferenceInfo + "</div></li>");
 		break;
 	    }
 	}
    }

           

  $('#stateDisplay').append(menu);
  $('#availableResources').append(availableResources);
  $('#peoplesPreferences').append(peoplesPreferences);
// load the things people can bring
// load the constraints/preferences...

// $('#stateDisplay').html(JSON.stringify(state.users));
}

    // does item help the constraint
   function helps(i){
	
    }

// or does it hurt it
    function hurts(i){

    }

// make a request
function request(userIndex, dishIndex){
    requestId = state.users[userIndex].userId;
    requestEmail = state.users[userIndex].email;

   $('#requestTo').html(state.users[userIndex].name);
   var end = "";
   if(username == null){
   }else{
       end = "\n\nBest, " + "\n" + username;
   }
   $('#requestMsg').html("Hi " + (state.users[userIndex].name.split(' '))[0] + ",\n\nI saw that you noted that you may be willing to bring " + state.users[userIndex].choices[dishIndex].description + " instead of something you are currently planning to bring. I think having " + state.users[userIndex].choices[dishIndex].description + " would be really wonderful!" + end);
}

function loadHostData(data){
    activity = data.name;
    description = data.description;
    categories = data.categories;
    verbal = data.preferences;


    $("#activity").html(data.name.replace(/\n/g, "<br/>"));
    $("#description").html(data.description.replace(/\n+$/, '').replace(/\n/g, "<br/>"));
    
    $("#verbal").html(verbal.join("<br/>"));
}

// TODO give an interface to enter new information from an individual
function loadInterface(){
    $('#preferences').empty();
    $('#choices').empty();

    createChoiceField('choices', '', -1, false, false);
    createField('preferences', 'preferenceSet', '', 400, false);
}


function createChoiceField(field, val, selectedIndex, picked, textOnly){
    var fname = '#' + field;
    
    var c;
    var d;

    if(textOnly){
	c = "<span style='display:inline-block;width:250px'>" + val + "</span>";
	d = "<span style='display:inline-block;width:100px'>" + categories[selectedIndex] + "</span>";
    }else{

	c = "<input type=\"text\" name=\"choiceSet\" value=\"" + val + "\"style='width:250px'\"></input>";
	d = "<select name=\"choiceCategory\">";
    
	
	for(var i = 0; i < categories.length; i++){
	    if(selectedIndex == i){
		d += "<option value=\'" + i + "\' selected='selected'>" + categories[i] + "</option>";
	    }else{
		d += "<option value=\'" + i + "\'>" + categories[i] + "</option>";
	    }
	}
	d += "</select> ";
    }
    if(textOnly){
	if(picked){
	    e = "<input type=\"checkbox\" name=\"previousChoiceSelected\" checked></input>";
	}else{
	    e = "<input type=\"checkbox\" name=\"previousChoiceSelected\"></input>";
	}
    }else{
	var e;
	if(picked){
	    e = "<input type=\"checkbox\" name=\"choiceSelected\" checked></input>";
	}else{
	    e = "<input type=\"checkbox\" name=\"choiceSelected\"></input>";
	}
    }
 $(fname).append(c); 
 $(fname).append(d); 
 $(fname).append(e); 
 $(fname).append("<br/>"); 

}


function choice(item, type, selected){
    this.description = item;
    this.type = type;
    this.id = null;		    
    this.selected = selected;
    this.preferencesAddressed = null;
    this.preferencesViolated = null;
}

function preference(description){
   this.description = description;
   this.id = null;		    
}

function getChoices(field){
    var fname = '#' + field;
    var inputsList = new Array();
    var inputs = $(fname + ' :input[name="choiceSet"]');
    inputs.each(function(){
	    inputsList.push($(this).val());
	    
	});

    var typesList = new Array();
    var types = $(fname + ' :input[name="choiceCategory"]');
    types.each(function(){
	    typesList.push($(this).val());
	});

    var selectedList = new Array();
    var selects = $(fname + ' :input[name="choiceSelected"]');
    selects.each(function(){
	    selectedList.push($(this).attr("checked"));
	});

    var clist = new Array();
    for(var i = 0; i < inputsList.length; i++){
	if(inputsList[i] != ""){
	    clist.push(new choice(inputsList[i], categories[typesList[i]], selectedList[i]));
	}
    }
    return clist;
}

function getPreferenceSet(field, name){
    var inputsList = new Array();
    var key = "#" + field + " :input[name=\"" + name + "\"]"; 
    var inputs = $(key);
    inputs.each(function(){
	    if($(this).val() != ""){
		inputsList.push(new preference($(this).val()));
	    }
	});
    return inputsList;
}


function Answer(){}

function gatherAnswers(){
    // check if state already contains user

    // find data on this particular user from 
    if(typeof userKeys[uid] != "undefined" && state.users[userKeys[uid]] != "undefined"){
	var userData = state.users[userKeys[uid]];
	
	// note changes made in selection
	var selects = $('#choices :input[name="previousChoiceSelected"]');
	selects.each(function(index){
		userData.choices[index].selected = $(this).attr("checked");
	    });

	// append new stuff
	userData.choices = userData.choices.concat(getChoices('choices'));
	var newPrefs = getPreferenceSet('preferences', 'preferenceSet');
	userData.preferences = userData.preferences.concat(newPrefs);
	userData.preferenceOrdering = getPreferenceOrdering();
	return JSON.stringify(userData);
    }else{
	// new submission
	
	var answer = new Answer();
	answer.name = $('#name').val();
	answer.email = $('#email').val();
	answer.choices = getChoices('choices');
	answer.preferences = getPreferenceSet('preferences', 'preferenceSet');
	answer.preferenceOrdering = getPreferenceOrdering();
	return JSON.stringify(answer);
    }
}

function getPreferenceOrdering(){
    var pa = $('#sortable').sortable('toArray');
    var pr =  pa.map(function(x){ return state.preferenceOrdering[x.substring(2)];});
    return pr;
}

function submitTask(){
    var answer = gatherAnswers();
    alert(answer);
    return;
     $.ajax({
	    type: "POST",
		url: "http://people.csail.mit.edu/hqz/mobi/submitEntry.php",
		data: ({
			userId : uid,
			    answer: answer,
			    taskId: tid, 
			    type: "potluck"}),
		success: function(msg){
		 alert("You have submitted your entry!");
		  loadTaskState(); 
		 		 alert(msg);
		// TODO: load on page
		// updateTasklist();
	    }
	 });
    return;
}

function createField(field, name, val, size, textOnly){
    if(textOnly){
	var c = "<span style='display:inline-block;width:" + size + "px'>" + val + "</span>";
	var fname = '#' + field;
	$(fname).append(c);
	$(fname).append("<br/>"); 
    }else{
	var c = "<input type=\"text\" name=\"" + name + "\" value=\"" + val +  "\" style='width:" + size + "px'\"></input>";
	var fname = '#' + field;
	$(fname).append(c);
	$(fname).append("<br/>"); 
    }
}

function readUrlParameters(){
   var params = getURLParams();		       
   if(params.tid){
     tid = params.tid;
   }

   if(params.uid){
       uid = params.uid;
       loadUserInfo();		       
   }else{
       // display need link
       displayNeedLink();
   }
 
   
  return;
}

function loadUserInfo() {
     $.ajax({
	    type: "GET",
		url: "http://people.csail.mit.edu/hqz/mobi/loadUserInfo.php",
		data: ({
			userId : uid,
		       taskId: tid, 
		       type: "potluck"}),
		success: function(obj){
		 if(obj != ""){
		     		       var info = eval('(' + obj + ')');
		     		       username = info.name;
		     		       email = info.email;
		     		       $('#email').val(email);
		     		       $('#name').val(username);

		 }else{
		     // load need unique link
		     displayNeedLink();
		 }      
	    }
	 });
    return;
}

function displayNeedLink(){

    $("#needLink").show();

}

function unescapeURL(s) {
    return decodeURIComponent(s.replace(/\+/g, "%20"))
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

$(document).ready(function(){
	 $("#needLink").hide();
	    $( "#sortable" ).sortable();
	    $( "#sortable" ).disableSelection();

   readUrlParameters(); // get userId and taskId
   //   loadTaskInfo(); // Load basic information on the task from the host
   loadTaskState(); // Load where we are current at with task
			    
    $("#submitter").click(function() {submitTask(); return false;});
});

function sendMessage(){
     $.ajax({
	    type: "POST",
		 url: "http://people.csail.mit.edu/hqz/mobi/sendMail.php",
		data: ({
			userId : uid,
		       taskId: tid, 
			    msg : $('#requestMsg').val(),
			    to : requestEmail,
			type: "potluck"}),
		success: function(obj){
		 //		 alert(obj);		      
		       
	    }
	 });
    return;

}


function sendLink(){
     $.ajax({
	    type: "POST",
		 url: "http://people.csail.mit.edu/hqz/mobi/sendLink.php",
		data: ({
			email: $('#reminderEmail').val(),
		        taskId: tid, 
			type: "potluck"}),
		success: function(obj){
		 if(obj == ""){
		     alert("Sorry, your email is not recognized in our system. Please try again or contact us for support.");
		 }else{
		     alert(obj);
		     //		     alert("Email with your unique link has been sent successfully.")
		 }
		       
	     }
	 });
    return;

}

function rtrim(str, chars) {
			    chars = chars || "\\s";
			    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
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

function g(a){var b=typeof a;if(b=="object")if(a){if(a instanceof Array||!(a instanceof Object)&&Object.prototype.toString.call(a)=="[object Array]"||typeof a.length=="number"&&typeof a.splice!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("splice"))return"array";if(!(a instanceof Object)&&(Object.prototype.toString.call(a)=="[object Function]"||typeof a.call!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("call")))return"function"}else return"null";
else if(b=="function"&&typeof a.call=="undefined")return"object";return b};function h(a){a=String(a);var b;b=/^\s*$/.test(a)?false:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,""));if(b)try{return eval("("+a+")")}catch(c){}throw Error("Invalid JSON string: "+a);}function i(a){var b=[];j(new k,a,b);return b.join("")}function k(){}
function j(a,b,c){switch(typeof b){case "string":l(a,b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(b==null){c.push("null");break}if(g(b)=="array"){var f=b.length;c.push("[");for(var d="",e=0;e<f;e++){c.push(d);j(a,b[e],c);d=","}c.push("]");break}c.push("{");f="";for(d in b)if(b.hasOwnProperty(d)){e=b[d];if(typeof e!="function"){c.push(f);l(a,d,c);c.push(":");j(a,e,c);f=","}}c.push("}");break;
case "function":break;default:throw Error("Unknown type: "+typeof b);}}var m={'"':'\\"',"\\":"\\\\","/":"\\/","\u0008":"\\b","\u000c":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\u000b":"\\u000b"},n=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;function l(a,b,c){c.push('"',b.replace(n,function(f){if(f in m)return m[f];var d=f.charCodeAt(0),e="\\u";if(d<16)e+="000";else if(d<256)e+="00";else if(d<4096)e+="0";return m[f]=e+d.toString(16)}),'"')};window.JSON||(window.JSON={});if(typeof window.JSON.serialize!=="function")window.JSON.serialize=i;if(typeof window.JSON.parse!=="function")window.JSON.parse=h;

