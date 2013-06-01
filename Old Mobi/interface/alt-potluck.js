function g(a){var b=typeof a;if(b=="object")if(a){if(a instanceof Array||!(a instanceof Object)&&Object.prototype.toString.call(a)=="[object Array]"||typeof a.length=="number"&&typeof a.splice!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("splice"))return"array";if(!(a instanceof Object)&&(Object.prototype.toString.call(a)=="[object Function]"||typeof a.call!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("call")))return"function"}else return"null";
else if(b=="function"&&typeof a.call=="undefined")return"object";return b};function h(a){a=String(a);var b;b=/^\s*$/.test(a)?false:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,""));if(b)try{return eval("("+a+")")}catch(c){}throw Error("Invalid JSON string: "+a);}function i(a){var b=[];j(new k,a,b);return b.join("")}function k(){}
function j(a,b,c){switch(typeof b){case "string":l(a,b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(b==null){c.push("null");break}if(g(b)=="array"){var f=b.length;c.push("[");for(var d="",e=0;e<f;e++){c.push(d);j(a,b[e],c);d=","}c.push("]");break}c.push("{");f="";for(d in b)if(b.hasOwnProperty(d)){e=b[d];if(typeof e!="function"){c.push(f);l(a,d,c);c.push(":");j(a,e,c);f=","}}c.push("}");break;
case "function":break;default:throw Error("Unknown type: "+typeof b);}}var m={'"':'\\"',"\\":"\\\\","/":"\\/","\u0008":"\\b","\u000c":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\u000b":"\\u000b"},n=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;function l(a,b,c){c.push('"',b.replace(n,function(f){if(f in m)return m[f];var d=f.charCodeAt(0),e="\\u";if(d<16)e+="000";else if(d<256)e+="00";else if(d<4096)e+="0";return m[f]=e+d.toString(16)}),'"')};window.JSON||(window.JSON={});if(typeof window.JSON.serialize!=="function")window.JSON.serialize=i;if(typeof window.JSON.parse!=="function")window.JSON.parse=h;

if(window.Prototype) {
    delete Object.prototype.toJSON;
    delete Array.prototype.toJSON;
    delete Hash.prototype.toJSON;
    delete String.prototype.toJSON;
}

var activity;
var description;
var categories;
var verbal;
var tid = '0f965d77ba1ed34015f5e3c7e0aa436a';
var uid = null; // TODO: get user id from parameters
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


function loadTaskState(){
   jQuery.ajax({
      type: "GET",
      // dataType: "json", 
      url: "http://people.csail.mit.edu/hqz/mobi/loadTaskState.php",
      data: ({type: "potluck", id: tid}),
      success: function(obj){

      if(obj == ""){
        // nothing to load
      }else{
          // read in the state
	//  state = eval('(' + obj.state + ')');
	  
	  state = eval('(' + obj + ')');
	  stateId = state.stateId;
          state = eval('(' + state.state + ')');
//	  alert(JSON.stringify(state));

	  loadHostData(state.admin); // host's stuff
	  loadInterface(); 
          loadStateIntoInterface();
//	  loadUserData();
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
    jQuery('#preferences').empty();
    jQuery('#choices').empty();

    for(var i = 0; i < userData.choices.length; i++){
	createChoiceField('choices', userData.choices[i].description, locateCategoryIndex(userData.choices[i].type), userData.choices[i].selected, true);
    }

    for(var i = 0; i < userData.preferences.length; i++){
	createField('preferences', 'preferenceSet', userData.preferences[i].description, 380, true);
    }
}


function showRequestPage(){
    jQuery('#planningWorkspace').hide();
    jQuery('#availableResourcesSpace').show();
}

function goBack(){
    jQuery('#planningWorkspace').show();
    jQuery('#availableResourcesSpace').hide();
}

function loadStateIntoInterface(){

  jQuery('#stateDisplay').empty();
  jQuery('#availableResources').empty();
  jQuery('#peoplesPreferences').empty();
  jQuery('#sortable').empty();

    // load user keys
    userKeys = [];
    for(var i = 0; i < state.users.length; i++){
	userKeys[state.users[i].userId] = i;
    }

// load the menu by catergory

    
    var menu ="";
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
	// NOTE: LOADS EVERYTHING BUT HIDES THE ONES THAT ARE NOT CURRENTLY SELECTED
	for(var k = 0; k < categories.length; k++){
	    menu += "<div id='menuCategory" + k + "'<b>" + categories[k] + "</b><br/><div id='menuContent" + k +  "'>";	    
	    
	    for(var i = 0; i < state.users.length; i++){
		for(var j = 0; j < state.users[i].choices.length; j++){
		    if(state.users[i].choices[j].type == categories[k]){
			if(state.users[i].choices[j].selected){
			    menu += "<div id='menu" + state.users[i].userId + state.users[i].choices[j].id + "' ><span style='color:rgb(0,0,0);line-height: 18px;margin-left:5px;font-size:0.75em'>" + state.users[i].choices[j].description + " (" + shortName(state.users[i].name) + ")<br/></span></div>";
			}else{
			    menu += "<div id='menu" + state.users[i].userId + state.users[i].choices[j].id + "'  style='display:none'><span style='color:rgb(0,0,0);line-height: 18px;margin-left:5px;font-size:0.75em' >" + state.users[i].choices[j].description + " (" + shortName(state.users[i].name) + ")<br/></span></div>";
				
			}
			
		    }
		}
	    }
	    
	    menu += "</div></div><br/>";
	}
    }

   // load resources
    var availableResources = "";//<br/><u>Things people may be willing to bring instead:</u><br/>";
    var table = jQuery(document.createElement('table'));
    jQuery(table).css({'width' : '90%'})
    
    var anyItems = false;
    for(var i = 0; i < state.users.length; i++){
	var hasItems = false;

	if(state.users[i].userId == uid) continue;
	var row = jQuery(document.createElement('tr'));
	row.append("<td>" + shortName(state.users[i].name) + "</td><td style='padding-left:1em'>");
	
	for(var j = 0; j < state.users[i].choices.length; j++){
	    if(!state.users[i].choices[j].selected){
		if(!hasItems){// first time
		    hasItems = true;
		    anyItems = true;
   row.append("/ <a href='#'  style='color:#0000CE' onclick=\"request(" + i + "," + j + ")\"><u>" + state.users[i].choices[j].description  + "</u></a>" + " / ");
//		    row.append("<span style='margin-left:0px'>/ </span>");-->
		}else{
		    row.append("<a href='#'  style='color:#0000CE' onclick=\"request(" + i + "," + j + ")\"><u>" + state.users[i].choices[j].description  + "</u></a>" + " / ");
		}
	    }
	}
	row.append('</td>');
	if(hasItems){
	    table.append(row);
	}
    }
    if(!anyItems){
	    var row = jQuery(document.createElement('tr'));
	row.append("<td><font color='red'>No dishes available for request. Please check back later.</font></td>");
	table.append(row);
    }
    
    // load the constraints
    var peoplesPreferences = "";//<br/><u>People's preferences (you can drag them to put the most important ones on top!)</u><br/>";

    for(var i = 0; i < state.preferenceOrdering.length; i++){
	var color = Math.floor((i / (state.preferenceOrdering.length)) * 125)
 	var pl = state.users[userKeys[state.preferenceOrdering[i].userId]].preferences;
 	for(var j = 0; j < pl.length; j++){
	    if(state.preferenceOrdering[i].id == pl[j].id){
		var preferenceInfo = pl[j].description + " (" + 
 		    shortName(state.users[userKeys[state.preferenceOrdering[i].userId]].name) + ")";
		// 		peoplesPreferences += preferenceInfo;
		// add it to sortable
//		var e = "<input type=\"checkbox\" name=\"choiceSelected\"></input>";


		var stuff = "<li id='po" + i + "'><span class='ui-icon ui-icon-arrowthick-2-n-s' style='width:12px'></span><span style='font-size:0.75em;margin-left:15px;width:90%;color:rgb(" + color + "," + color + "," + color + ")' ><span id='preference" + pl[j].id + "'>" + preferenceInfo + "</span></span></li>";
		jQuery('#sortable').append(stuff);


//		jQuery('#sortable').append("<li id='po" + i + "'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span><span style='font-size:0.9em;margin-left:10px;width:170px;color:rgb(" + color + "," + color + "," + color + ")' >" + preferenceInfo + "</span></li>");
//<span class='ui-icon ui-icon-arrowthick-2-n-s'></span>
 		break;
 	    }
 	}
    }

           

  jQuery('#stateDisplay').append(menu);
    jQuery('#availableResources').append(table);
  jQuery('#peoplesPreferences').append(peoplesPreferences);
// load the things people can bring
// load the constraints/preferences...

// jQuery('#stateDisplay').html(JSON.stringify(state.users));
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
    sn = sn;
    sn = sn.split(' ');
    return sn[0]; // + " " + sn[sn.length-1][0] + ".";
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
    requestItem = state.users[userIndex].choices[dishIndex];

    jQuery('#requestTo').html(shortName(state.users[userIndex].name));
   var end = "";
   if(username == null){
   }else{
       end = "\nBest, \n" + firstName(username);
   }
   jQuery('#requestMsg').html("Hi " + (state.users[userIndex].name.split(' '))[0] + ",\n\nI saw that you may be willing to bring " + state.users[userIndex].choices[dishIndex].description + " as an alternative to what you are currently planning to bring. I think having " + state.users[userIndex].choices[dishIndex].description + " would be really wonderful!\n" + end);

    jQuery('#sendMessage').removeAttr('disabled');
}

function loadHostData(data){
    activity = data.name;
    description = data.description;
//description = "The potluck will start at 6:30pm on Friday, March 25th. David's house is at 18 Lee St. in Cambridge. David will provide utensils, plates, napkins, as well as water, soda, and wine. We will be able to use the oven and microwave to heat food as needed!"; 
    categories = data.categories;
    verbal = data.preferences;

    jQuery("#activity").html("<h3>" + data.name.replace(/\n/g, "<br/>") + "</h3>");
    jQuery("#description").html("<div style='margin-top:0px;margin-left:10px'>" + description.replace(/\n+$/, '').replace(/\n/g, "<br/>") + "</div>");
    jQuery("#verbal").html(verbal.join("<br/>"));
}

// TODO give an interface to enter new information from an individual
function loadInterface(){
    jQuery('#preferences').empty();
    jQuery('#choices').empty();

//    createChoiceField('choices', '', -1, false, false);
//    createField('preferences', 'preferenceSet', '', 380, false);
}


function createChoiceField(field, val, selectedIndex, picked, textOnly){
    var fname = '#' + field;
    var itemDiv = jQuery(document.createElement('div'));


    if(textOnly){
	jQuery(itemDiv).addClass('previousChoiceDiv');
    }else{
	// field someone can enter. Add it to the array
	newFieldId++;
	var newitem = new choice('', categories[0], false);
	newitem.id = newFieldId;
	newChoices.push(newitem);

	jQuery(itemDiv).addClass('ChoiceDiv');

	// add the display element
	createMenuItemDisplay(newitem.id, 0, '');

    }

    var c;
    var d;

    if(textOnly){
	c = "<span style='width:50%'>" + val + "</span>";
	d = "<span style='width:30%'>" + categories[selectedIndex] + "</span>";
    }else{

	c = "<span style='width:50%'><input type=\"text\" maxlength='40' onkeyup='updateMenuItemDescription(this)' name=\"choiceSet\" value=\"" + val + "\"style='width:50%'\"></input></span>";
	d = "<span style='display:inline;width:30%'><select name=\"choiceCategory\" onchange='changeCategoryDisplay(this)'></span>";

	for(var i = 0; i < categories.length; i++){
	    if(selectedIndex == i){
		d += "<option value=\'" + i + "\' selected='selected'>" + categories[i] + "</option>";
	    }else{
		d += "<option value=\'" + i + "\'>" + categories[i] + "</option>";
	    }
	}
	d += "</select>";
    }
    if(textOnly){
	if(picked){
	    e = "<input type=\"checkbox\" onclick='updateCheck(this)' style='margin-left:10px;vertical-align:middle;' name=\"previousChoiceSelected\" checked></input>";
	}else{
	    e = "<input type=\"checkbox\" onclick='updateCheck(this)' style='margin-left:10px;vertical-align:middle;' name=\"previousChoiceSelected\"></input>";
	}
    }else{
	var e;
	if(picked){
	    e = "<input type=\"checkbox\" onclick='updateCheck(this)' style='margin-left:10px;vertical-align:middle;' name=\"choiceSelected\" checked></input>";
	}else{
	    e = "<input type=\"checkbox\" onclick='updateCheck(this)' style='margin-left:10px;vertical-align:middle;' name=\"choiceSelected\"></input>";
	}
    }
    var f = "<img src='exit.png' width='11' style='margin-left:20px;vertical-align:middle;' onClick='removeItem(this)'>";

    jQuery(itemDiv).append(c); 
    jQuery(itemDiv).append(d); 
    jQuery(itemDiv).append(e); 
    jQuery(itemDiv).append(f); 

    jQuery(fname).append(itemDiv); 

}
function removePreference(e){
    // TODO: currently relies on gatheranswers to remove it from the wish list... but maybe should do it here?
    var index;
    var ediv = jQuery(e).closest('div');


    if(ediv.attr('class') == 'preferencesDiv'){
	index = jQuery('.preferencesDiv').index(ediv); 
	ediv.remove();
	var id = '#newpref' + newPreferences[index].id;
	jQuery(id).remove();//css('display', 'none');
	newPreferences.splice(index,1);
	
    }else if(ediv.attr('class') == 'previouspreferencesDiv'){
	index = jQuery('.previouspreferencesDiv').index(ediv); 
	var id = '#preference' + state.users[userKeys[uid]].preferences[index].id;
	var eid = jQuery(id).closest('li');
	jQuery(eid).remove();//css('display', 'none');

	state.users[userKeys[uid]].preferences.splice(index, 1);
	ediv.remove();
    }
}

function removeItem(e){
    var index;
    var ediv = jQuery(e).closest('div');
    if(ediv.attr('class') == 'ChoiceDiv'){
	index = jQuery('.ChoiceDiv').index(ediv); 
	ediv.remove();
	jQuery('#newmenu' + newChoices[index].id).remove();
	newChoices.splice(index, 1);
    }else if(ediv.attr('class') == 'previousChoiceDiv'){
	index = jQuery('.previousChoiceDiv').index(ediv); 
	var menuid = '#menu' + uid + state.users[userKeys[uid]].choices[index].id;
	jQuery(menuid).remove();//css('display', 'none');
	state.users[userKeys[uid]].choices.splice(index, 1);
	ediv.remove();
    }
//ediv.index());
}


function updatePreferenceDescription(e){
    var index;
    var ediv = jQuery(e).closest('div');
    index = jQuery('.preferencesDiv').index(ediv); 
    newPreferences[index].description = jQuery(e).val();
    jQuery('#newprefdescription' + newPreferences[index].id).html(jQuery(e).val());
    if(jQuery(e).val() == ''){
	jQuery('#newpref' + newPreferences[index].id).css('display', 'none');
    }else{
	jQuery('#newpref' + newPreferences[index].id).css('display', 'inline');
    }
}



function createPreferenceDisplay(id, desc){
    var color = 0;
    var stuff = "<li style='display:none;' id='newpref" + id + "'><span class='ui-icon ui-icon-arrowthick-2-n-s' style='width:12px'></span><span style='font-size:0.75em;margin-left:15px;width:90%;color:rgb(" + color + "," + color + "," + color + ")'><span id='preference" + id + "'><span id='newprefdescription" + id + "'>" + desc + "</span><span> (" + shortName(username) + ")</span></span></span></li>";

    jQuery('#sortable').prepend(stuff);
}

function createMenuItemDisplay(id, catIndex, desc){
    var item = "<div id='newmenu" + id + "'  style='width:80%;display:none'> <span style='color:rgb(0,0,0);line-height: 18px;margin-left:5px;font-size:0.75em' ><span id='newdescription" + id + "'>" + desc + "</span><span> (" + shortName(username) + ")</span></span> </div>";
    jQuery('#menuContent' + catIndex).prepend(item);
}

function updateMenuItemDescription(e){
    // var t = jQuery(e).val();
    // if(t.length > 50){
    // 	jQuery(e).val(t.substr(0, 50));
    // 	return false;
    // }

    var index;
    var ediv = jQuery(e).closest('div');
    index = jQuery('.ChoiceDiv').index(ediv); 
    newChoices[index].description = jQuery(e).val();
    jQuery('#newdescription' + newChoices[index].id).html(newChoices[index].description);

    if(jQuery(e).val() == ''){
	jQuery('#newmenu' + newChoices[index].id).css('display', 'none');
    }else if(newChoices[index].selected){
	jQuery('#newmenu' + newChoices[index].id).css('display', 'inline');
    }
}

function changeCategoryDisplay(e){
    var index;
    var ediv = jQuery(e).closest('div');
    index = jQuery('.ChoiceDiv').index(ediv); 
    newChoices[index].type = categories[e.selectedIndex];
    jQuery('#newmenu' + newChoices[index].id).remove();
    
    createMenuItemDisplay(newChoices[index].id, e.selectedIndex, newChoices[index].description);

    if(newChoices[index].selected){
	jQuery('#newmenu' + newChoices[index].id).css('display','inline');
    }
}



function updateCheck(e){
    var index;
    var ediv = jQuery(e).closest('div');

    if(ediv.attr('class') == 'ChoiceDiv'){
	// display it, and then 
	index = jQuery('.ChoiceDiv').index(ediv); 
	newChoices[index].selected = !newChoices[index].selected;
	var menuid = '#newmenu' + newChoices[index].id;

//	alert(JSON.stringify(newChoices));

	// assume all information changes are already taken care of
	if(jQuery(e).attr('checked')){
	    jQuery(menuid).css('display', 'inline');
	}else{
	    jQuery(menuid).css('display', 'none');
	}

    }else if(ediv.attr('class') == 'previousChoiceDiv'){
	index = jQuery('.previousChoiceDiv').index(ediv); 
	var menuid = '#menu' + uid + state.users[userKeys[uid]].choices[index].id;

	if(jQuery(e).attr('checked')){
	    jQuery(menuid).css('display', 'inline');
	}else{
	    jQuery(menuid).css('display', 'none');
	}
    }
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
    var inputs = jQuery(fname + ' :input[name="choiceSet"]');
    inputs.each(function(){
	    inputsList.push(jQuery(this).val());
	    
	});

    var typesList = new Array();
    var types = jQuery(fname + ' :input[name="choiceCategory"]');
    types.each(function(){
	    typesList.push(jQuery(this).val());
	});

    var selectedList = new Array();
    var selects = jQuery(fname + ' :input[name="choiceSelected"]');
    selects.each(function(){
	    selectedList.push(jQuery(this).attr("checked"));
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
    var inputs = jQuery(key);
    inputs.each(function(){
	    if(jQuery(this).val() != ""){
		inputsList.push(new preference(jQuery(this).val()));
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
	var selects = jQuery('#choices :input[name="previousChoiceSelected"]');
	selects.each(function(index){
		userData.choices[index].selected = jQuery(this).attr("checked");
	    });

//	alert(JSON.stringify(userData));
	// append new stuff
	userData.choices = userData.choices.concat(getChoices('choices'));
	var newPrefs = getPreferenceSet('preferences', 'preferenceSet');
	userData.preferences = userData.preferences.concat(newPrefs);
	userData.preferenceOrdering = getPreferenceOrdering();
	return JSON.stringify(userData);
    }else{
	// new submission
	var answer = new Answer();
	answer.name = username;
	answer.email = email;
	answer.choices = getChoices('choices');
	answer.preferences = getPreferenceSet('preferences', 'preferenceSet');
	answer.preferenceOrdering = getPreferenceOrdering();
	return JSON.stringify(answer);
    }
}

function getPreferenceOrdering(){
    //alert(JSON.stringify(state.preferenceOrdering));
    var pa = jQuery('#sortable').sortable('toArray');

    var pa = pa.filter(function(x) {return x.substr(0,3) != "new"});
    var pr =  pa.map(function(x){ return state.preferenceOrdering[x.substring(2)];});

    if(typeof userKeys[uid] == "undefined"){
	return pr;
    }
    var rt =  pr;
    //pr.filter(function(x) {
	// NOTE: I believe this is taken care of by code elsewhere, because ordering is reflected already in the items
	// remove anything from ordering that the user removed already
//	var plist = state.users[userKeys[uid]].preferences.filter(function(y) { return y.id == x.id; })
//	alert(x.id + "," + JSON.stringify(plist));
//	return plist.length > 0;
 //   });

   // alert(JSON.stringify(rt));
    return rt;
}

function submitTask(){
    var answer = gatherAnswers();
     jQuery.ajax({
	    type: "POST",
		url: "http://people.csail.mit.edu/hqz/mobi/submitEntry.php",
		data: ({
			userId : uid,
			    answer: answer,
			    taskId: tid, 
			    type: "potluck"}),
		success: function(msg){
		 alert("You have submitted your entry!");

		    newFieldId = 0;
		    newPreferenceId = 0;
		    newChoices = [];
		    newPreferences = [];
		    
		    loadTaskState(); 
		    //		 alert(msg);
		// TODO: load on page
		// updateTasklist();
	    }
	 });
    return;
}

function createField(field, name, val, size, textOnly){
    var itemDiv = jQuery(document.createElement('div'));
    var ua = jQuery.browser;

    var c;
    if(textOnly){
	jQuery(itemDiv).addClass('previous'+field+'Div');
    }else{
	// create new item
	newPreferenceId++;
	var newpref = new preference('');
	newpref.id = newPreferenceId;
	newPreferences.push(newpref);
	createPreferenceDisplay(newpref.id, '');
	jQuery(itemDiv).addClass(field +'Div');
	// new field
    }

    if(textOnly){
	c = "<span style='display:inline;width:80%>" + val + "</span>";
    }else{
	c = "<input type=\"text\" maxlength='80' style='width:80%' onkeyup='updatePreferenceDescription(this)' name=\"" + name + "\" value=\"" + val +  "\"/>";
	
    }
    var fname = '#' + field;
    var f = " <img src='exit.png' width='11' style='vertical-align:middle;margin-left:5px;' onClick='removePreference(this)'/>";

    jQuery(itemDiv).append(c);
    jQuery(itemDiv).append(f);

    jQuery(fname).append(itemDiv);
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
    loadUserInfo();		       
   
  return;
}

function showMobi(){
    jQuery('#mobi-content').css('display', 'inline');
}

function loadUserInfo() {

    jQuery.ajax({
	    type: "GET",
		url: "http://people.csail.mit.edu/hqz/mobi/loadUserInfo.php",
	async : false,
		data: ({
			userId : uid,
		       taskId: tid, 
		       type: "potluck"}),
		success: function(obj){
		 if(obj != ""){
		     		       var info = eval('(' + obj + ')');
		     		       username = info.name;
		     		       email = info.email;
		//     		       jQuery('#email').val(email);
		//     		       jQuery('#name').val(username);

		 }else{
		     // load need unique link
		     displayNeedLink();
		 }      
	    }
	 });
    return;
}

function displayNeedLink(){
    jQuery("#needLink").css('display', 'block');
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

jQuery.noConflict();
jQuery(document).ready(function(jQuery) {
    var ua = jQuery.browser;
    if ( ua.msie ) {
	jQuery('#mobi-content').css('height','830px');
	jQuery('#header_layer').css('height','820px');

//	$("#div ul li ").css( "display","inline" );
    }

    jQuery("#availableResourcesSpace").hide();

//    jQuery( "#sortable" ).sortable();
 //   jQuery( "#sortable" ).disableSelection();

    jQuery( "#sortable" ).sortable();
    jQuery( "#sortable" ).disableSelection();

    readUrlParameters(); // get userId and taskId
    //   loadTaskInfo(); // Load basic information on the task from the host
    loadTaskState(); // Load where we are current at with task
    
    jQuery("#submitter").click(function() {submitTask(); return false;});

});



function sendMessage(){
     jQuery.ajax({
	    type: "POST",
		 url: "http://people.csail.mit.edu/hqz/mobi/sendMail.php",
		data: ({
		    from : username, 
		    fromemail: email, 
		    userId : uid,
		    taskId: tid, 
			    msg : jQuery('#requestMsg').val(),
			    to : requestEmail,
		    item : JSON.stringify(requestItem),
		    toId : requestId,
		    stateId: stateId,
			type: "potluck"}),
		success: function(obj){
//		 		 alert(obj);		      
		    alert("Your request has been sent!");
	    }
	 });
    return;

}


function sendLink(){
     jQuery.ajax({
	    type: "POST",
		 url: "http://people.csail.mit.edu/hqz/mobi/sendLink.php",
		data: ({
			email: jQuery('#reminderEmail').val(),
		        taskId: tid, 
			type: "potluck"}),
		success: function(obj){
		 if(obj == ""){
		     alert("Sorry, your email is not recognized in our system. Please try again or contact us for support.");
		 }else{
		     
//		     alert(obj);
		     		     alert("Email with your unique link has been sent successfully.")
		 }
		       
	     }
	 });
    return;

}

// function rtrim(strz, chars) {
//     chars = chars || "\\s";
//    return strz.replace(new RegExp("[" + chars + "]+$", "g"), "");
// }



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
