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

var uid = null;
var tid = null;
var currentExperiment = -1;
var numExperiments = 3;
var userKeys = null;
var state = null;
var conditionHandle = null;
var username = null;
var email = null;
var activity;
var description;
var categories;
var verbal;
var userResults = new Result();

function Result(){
    this.seeNothing = null;
    this.seeItems = null;
    this.seeAll = null;
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
		}      
	    }
	});
    return;
}

function loadTask(){
    if(state == null){
	jQuery.ajax({
		type: "GET",
		    url: "http://people.csail.mit.edu/hqz/mobi/loadExperimentState.php",
		    data: ({type: "potluck", id: tid}),
		    async: false,
		success: function(obj){
		    if(obj == ""){
		    }else{
			state = eval('(' + obj + ')');
			state = eval('(' + state.state + ')');
			
		    }
		    loadHostData(state.seeNothing.admin); // host's stuff
		    return;
		}});
    }
  
    if(currentExperiment == -1){
	return;
    }

    // have loaded state info by now
    if(currentExperiment == 0){
	conditionHandle = state.seeNothing;
	taskInstructions("Scenario 1", "Without knowing what others are bringing to the potluck, what would you bring?");
    }else if(currentExperiment == 1){
	conditionHandle = state.seeItems;
	taskInstructions("Scenario 2.", "On the right you are shown items others said they would bring, having seen previous responses in this scenario. Given this, what would you bring?");
	$('#shapeimage1').css('display','block');
    }else if(currentExperiment == 2){
	conditionHandle = state.seeAll;
	taskInstructions("Scenario 3", "On the right you are shown items others said they would bring and their wishes for what they like to see at the potluck.  Given this, what would you bring and what would you add to the wishlist?");
	$('#shapeimage1').css('display','block');
	$('#shapeimage2').css('display','block');
    }
    

      // 	  loadInterface(); 
      //     loadStateIntoInterface();
      // 	  loadUserData();
      // }
}

function loadHostData(data){
    categories = data.categories;
    activity = data.name;
    description = data.description;
    verbal = data.preferences;
    
    $('#activity').html("<h3>" + activity.replace(/\n/g, "<br/>") + "</h3>");
    $('#description').html("<div style='margin-left:10px'>" + description.replace(/\n+$/, '').replace(/\n/g, "<br/>") + "</div>");
    
    $("#activity").css('display', 'block');
    $("#description").css('display', 'block');
}

function taskInstructions(title, b){
   $('#taskTitle').html("<font color='black'>" + title + "</font>");
    $('#taskBody').html(b);
}


function loadInstructions(){
    if(currentExperiment == -1){
	instructions("Hello " + firstName(username) + ",", "We are glad you will be joining us for the potluck! We'd like you to participate in planning the potluck menu with other attendees by doing the following:<br/><ul><li>In an one-time experiment, tell us what you would bring to the potluck under three scenarios.</li> <li>Use a new tool to plan the actual potluck with other potluck attendees.</li></ul>The whole thing should take no longer than 15 minutes, and you are welcome to keep revising the menu using our tool after the experiment at any time.<br/><br/>Ready?  Click the arrow to begin!");
    }else if(currentExperiment == 0){
	instructions("Scenario 1", "Please use the following interface to let us know what you would bring to the potluck.  <br><br><font color='blue'>In this scenario, you are not told what others are bringing.</font>");
    }else if(currentExperiment == 1){
	instructions("Scenario 2", "Please use the following interface to let us know what you would bring to the potluck.  <br><br><font color='blue'>In this scenario, you are told what others said they would bring to the potluck.</font>");
    }else if(currentExperiment == 2){
	$('#shapeimage1').css('display','none');
	instructions("Scenario 3", "Please use the following interface to let us know what you would bring to the potluck and what's on your wish list for the potluck. <br><br><font color='blue'>In this scenario, you are told what others said they would bring to the potluck and their wish lists.</font> <u>NOTE:</u>  The menu may be different from the previous scenario, so you may need to re-evaluate when choosing what item(s) to bring.");
    }else if(currentExperiment == 3){
	$('#shapeimage1').css('display','none');
	$('#shapeimage2').css('display','none');
	instructions("Ready for actual potluck planning", "Thank you for completing the scenarios. Please use the following tool to plan the actual potluck. On subsequent visits to the site, you will be automatically taken to this tool and will not have to re-complete the scenarios.");
    }
      }

function showExperiment(){
    if(currentExperiment == -1){
	currentExperiment = 0;
	loadInstructions();
	return;
    }
    if(currentExperiment == numExperiments){
	parent.moveOn();
    }else{
	$('#instructions').css('display','none');
	loadTask();
	$('#task').css('display','block');

	if(currentExperiment == 1){
	    loadMenu();
	    $('#task').css({left:'30%',
			   width : '450px'});
	    $('#menu-section').css('display', 'block');
	}
	if(currentExperiment == 2){
	    loadMenu();
	    loadWishlist();
	    $('#addPreferences').css('display','block');
	    $('#task').css({left:'30%', width : '450px'});
	    $('#menu-section').css('display', 'block');
	    $('#wishlist-section').css('display', 'block');
	    $('#nextExpButton').val('submit scenario results');
	}
    }
}

function nextExperiment(){
    if(currentExperiment < numExperiments){
	saveExperiment();
	$('#task').css('display','none');
	$('#menu-section').css('display', 'none');
	$('#wishlist-section').css('display', 'none');
	loadInstructions();
    }
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

    var clist = new Array();
    for(var i = 0; i < inputsList.length; i++){
	if(inputsList[i] != ""){
	    clist.push(new choice(inputsList[i], categories[typesList[i]], true));
	}
    }
    return clist;
}

function preference(desc){
   this.description = desc;
   this.id = null;		    
}

function choice(item, type, selected){
    this.description = item;
    this.type = type;
    this.id = null;		    
    this.selected = selected;
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


function removePreference(e){
    var index;
    var ediv = jQuery(e).closest('div');
    if(ediv.attr('class') == 'preferencesDiv'){
	index = jQuery('.preferencesDiv').index(ediv); 
	ediv.remove();
    }
}

function saveExperiment(){
    // store results from this experiment into the state
   
    // save items
    var answer = new Answer();
    answer.name = username;
    answer.email = email;
    answer.choices = getChoices('choices');
    // save preferences
    if(currentExperiment == 2){
	answer.preferences = getPreferenceSet('preferences', 'preferenceSet');
    }
    // save it
    if(currentExperiment == 0){
	userResults.seeNothing = answer;
    }else if(currentExperiment == 1){
	userResults.seeItems = answer;
    }else if(currentExperiment == 2){
	userResults.seeAll = answer;
    }

    // load stuff for next experiment
    currentExperiment+=1;
    if(currentExperiment == numExperiments){
	submitExperiments();
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
    sn = sn;
    sn = sn.split(' ');
    return sn[0]; // + " " + sn[sn.length-1][0] + ".";
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


function Answer(){}
function gatherExperimentAnswers(){
    return JSON.stringify(userResults);
}

function nextExperimentConfirm(){
    var doIt=confirm('Are you done with this scenario?');
    if(doIt){
	nextExperiment();
    }
    else{
	
    }
}


function submitExperiments(){
    var answer = gatherExperimentAnswers();

     jQuery.ajax({
	    type: "POST",
		url: "http://people.csail.mit.edu/hqz/mobi/submitExperimentEntry.php",
		 async: false,
		data: ({
			userId : uid,
			    answer: answer,
			    taskId: tid, 
			    type: "potluck"}),
		success: function(msg){
		  alert("You have submitted the experiment results! You can now plan for the actual potluck using mobi!");
		 //		 alert(msg);
		 
	    }
	 });
    return;
}

function loadWishlist(){
    var peoplesPreferences = "";
    var color = 0;

    for(var i = 0; i < conditionHandle.users.length; i++){
	for(var j = 0; j < conditionHandle.users[i].preferences.length; j++){
		var preferenceInfo = conditionHandle.users[i].preferences[j].description + " (" + 
 		    shortName(conditionHandle.users[i].name) + ")<br/>";
		jQuery('#sortable').append("<li><p class='paragraph_style'><span style='font-size:0.75em;display:inline-block;line-height:18px;margin-left:10px;width:210px;color:rgb(" + color + "," + color + "," + color + ")' class='style_1'>" + preferenceInfo + "</span></p>");
 	}
    }
}


function loadMenu(){
    // load user keys
    userKeys = [];
    for(var i = 0; i < conditionHandle.users.length; i++){
	userKeys[conditionHandle.users[i].userId] = i;
    }
    var menu ="";
    for(var k = 0; k < categories.length; k++){
	menu += "<div id='menuCategory" + k + "' class='style_1'><b>" + categories[k] + "</b><br/>";	    
	for(var i = 0; i < conditionHandle.users.length; i++){
	    for(var j = 0; j < conditionHandle.users[i].choices.length; j++){
		if(conditionHandle.users[i].choices[j].type == categories[k] && conditionHandle.users[i].choices[j].selected){
		    menu += "<p class='paragraph_style'><span style='color:rgb(0,0,0);line-height: 18px;margin-left:5px;font-size:0.75em' class='style_1'>" + conditionHandle.users[i].choices[j].description + " (" + shortName(conditionHandle.users[i].name) + ")<br/></span></p>";
		    }
	    }
	}
	
	menu += "</div><br/>";
    }

  jQuery('#menuDisplay').html(menu);
}

function instructions(title, b){
   $('#instructionTitle').html("<font color='black'>" + title + "</font>");
    $('#instructionBody').html(b);
    $('#instructions').css('display','block');
}

function readUrlParameters(){
   var params = getURLParams();		       
   if(params.tid){
     tid = params.tid;
   }

   if(params.uid){
       uid = params.uid;
   }
  return;
}


function removeItem(e){
    var index;
    var ediv = jQuery(e).closest('div');
    if(ediv.attr('class') == 'ChoiceDiv'){
	index = jQuery('.ChoiceDiv').index(ediv); 
	ediv.remove();
    }
}

function createField(field, name, val, size){
    var itemDiv = jQuery(document.createElement('div'));
    var c;
    jQuery(itemDiv).addClass(field +'Div');
    c = "<span style='inline-block';><input type=\"text\" name=\"" + name + "\" value=\"" + val +  "\" maxlength='80' style='width:" + size + "px'\"></input></span>";
    
    
    var fname = '#' + field;
    var f = "<img src='exit.png' width='11' style='vertical-align:middle;margin-left:25px' onClick='removePreference(this)'></img>";
    jQuery(itemDiv).append(c);
    jQuery(itemDiv).append(f);

    jQuery(fname).append(itemDiv);
}

function createChoiceField(field, val){
    var fname = '#' + field;
    var itemDiv = jQuery(document.createElement('div'));
    jQuery(itemDiv).addClass('ChoiceDiv');
    var c;
    var d;
    var e;
    var f;
    c = "<input type=\"text\" name=\"choiceSet\" maxlength='40' value=\"" + val + "\"style='width:250px'\"></input>";
    d = "<select name=\"choiceCategory\" width:'100px' style='display:inline-block;margin-left:10px;width:100px'>";
    for(var i = 0; i < categories.length; i++){
	d += "<option value=\'" + i + "\'>" + categories[i] + "</option>";
    }
    d += "</select>";
    f = "<img src='exit.png' width='11' style='vertical-align:middle;margin-left:40px' alt='' onClick='removeItem(this)'>";

    jQuery(itemDiv).append(c); 
        jQuery(itemDiv).append(d); 
    //jQuery(itemDiv).append(e); 
    jQuery(itemDiv).append(f); 

    jQuery(fname).append(itemDiv); 

}


$(document).ready(function() {
	readUrlParameters(); 
	loadUserInfo();
	loadTask();
	loadInstructions();

});