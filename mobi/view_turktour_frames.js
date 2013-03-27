function g(a){var b=typeof a;if(b=="object")if(a){if(a instanceof Array||!(a instanceof Object)&&Object.prototype.toString.call(a)=="[object Array]"||typeof a.length=="number"&&typeof a.splice!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("splice"))return"array";if(!(a instanceof Object)&&(Object.prototype.toString.call(a)=="[object Function]"||typeof a.call!="undefined"&&typeof a.propertyIsEnumerable!="undefined"&&!a.propertyIsEnumerable("call")))return"function"}else return"null";
else if(b=="function"&&typeof a.call=="undefined")return"object";return b};function h(a){a=String(a);var b;b=/^\s*$/.test(a)?false:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,""));if(b)try{return eval("("+a+")")}catch(c){}throw Error("Invalid JSON string: "+a);}function i(a){var b=[];j(new k,a,b);return b.join("")}function k(){}
function j(a,b,c){switch(typeof b){case "string":l(a,b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(b==null){c.push("null");break}if(g(b)=="array"){var f=b.length;c.push("[");for(var d="",e=0;e<f;e++){c.push(d);j(a,b[e],c);d=","}c.push("]");break}c.push("{");f="";for(d in b)if(b.hasOwnProperty(d)){e=b[d];if(typeof e!="function"){c.push(f);l(a,d,c);c.push(":");j(a,e,c);f=","}}c.push("}");break;
case "function":break;default:throw Error("Unknown type: "+typeof b);}}var m={'"':'\\"',"\\":"\\\\","/":"\\/","\u0008":"\\b","\u000c":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\u000b":"\\u000b"},n=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;function l(a,b,c){c.push('"',b.replace(n,function(f){if(f in m)return m[f];var d=f.charCodeAt(0),e="\\u";if(d<16)e+="000";else if(d<256)e+="00";else if(d<4096)e+="0";return m[f]=e+d.toString(16)}),'"')};window.JSON||(window.JSON={});if(typeof window.JSON.serialize!=="function")window.JSON.serialize=i;if(typeof window.JSON.parse!=="function")window.JSON.parse=h;

var data = [];
var tasks = [];
tasks['1123ce0dc842a4303485c1a99cccb2fc'] = 'notodo-nyc';
tasks['45eafca47e3e5152fe562ed285c70158'] = 'notodo-dc';
tasks['8786420c50bab8c79478366fe4efb7d8'] = 'notodo-vegas';
tasks['7ce5948bb8e05d7a94d58e51f5050a24'] = 'notodo-chicago';
tasks['f49f91faaf9d7e7f23eabdafd83af7d5'] = 'notodo-la';
tasks['a260e81f6d1c4428f5459b5cdd085ad0'] = 'notodo-sandiego';
tasks['f88b5200722cb598aa2c6d67a9ddef6e'] = 'notodo-sf';
tasks['4809eb7fa70905ad56954d622ddd770e'] = 'notodo-seattle';
tasks['58103adc14e6576f21a1ac161385fefe'] = 'todo-seattle';
tasks['cc0732f631e235904a4556e75088bade'] = 'todo-la1';
tasks['b848c58c7dc473949c823bc6f57d8a93'] = 'todo-sandiego1';
tasks['d2177136ca6c46bb254931c85553903e'] = 'todo-sf1';
tasks['8c9dff1762104b7ad6fe26c639a66a65'] = 'todo-nyc';
tasks['b9243ff1c0e7d4297f3bcd6b36420c1f'] = 'todo-vegas';
tasks['22d3290d1ab1ae9ba4257fca7ae60e87'] = 'todo-dc';
tasks['e986eb05cb9cbce4e9a7555c907f7256'] = 'todo-chicago';

function drawBars(length, color){
    var s = document.createElement('span');
    $(s).css('width', length);
    $(s).css('background', color);
//    $(s).css('color', color);
    $(s).css('display', 'inline-block');
    $(s).html('&nbsp;');
    $(s).css('font-size', '50%');
    return s;
}

function loadExperimentFrames(){
   jQuery.ajax({
	type: "GET",
	dataType: "json", 
        url: "http://people.csail.mit.edu/hqz/mobi/loadTurkTourFrames.php",
	async: false, 
	success: function(obj){
	    if(obj == ""){
	    }else{
		for(var i = 0; i < obj.length; i++){
		    var item = eval('(' + obj[i].answer + ')');
//		    alert(JSON.stringify(item));
		    item.tid = obj[i].tid;
		    data.push(item);	
		}
	    }
	}
   });
    return;
}

function colorByNumber(i){
    var colors = ['blue', 'green', 'red', 'chocolate', 'orange', 'purple', 'goldenrod', 'brown'];
    if(i >= colors.length){
	return colors[colors.length-1];
    }
    return colors[i];
}

function drawText(length, text){
    var s = drawBars(length, 'white');
    $(s).html(text);
    return s;
}

function mapTypes(t){
    if(t == 'it'){
	return 'blue';
    }else if(t=='str'){
	return 'green';
    }else if(t=='both'){
	return 'red';
    }

    if(t =='add'){
	return 'green';
    }else if(t=='remove'){
	return 'red';

    }else if(t=='reorder'){
	return 'blue';
    }else if(t=='update'){
	return 'gold';
    }else if(t=='same'){
	return 'black';
    }
}

function generateItineraryGraph(d, everyEdit){
    if(!everyEdit){
	$('#data').append("Itinerary by the category on a time scale from one HIT to the next<br/>");
    }else{
	$('#data').append("Itinerary by the category on a time scale from one edit to the next<Br/>");
    }
    var c = 0;
    for(var i = 0; i < d.length ; i++){
	// // continue if only changed itinerary
	// if(typeof(d[i].type) != 'undefined' && d[i].type == 'str'){
	//     continue;
	// }
	// continue if still the same HIT
	if(!everyEdit){
	    if(i < d.length - 1 && typeof(d[i].assignmentId) != 'undefined' && d[i].assignmentId == d[i+1].assignmentId){
		continue;
	    }
	}
	$('#data').append(drawText('20px', c)); 
	for(var j = 0; j < d[i].times.length; j++){
	    var color = 'green';
	    if((d[i].times[j].end - d[i].beginTime) > 1.05 * d[i].allowedTime){
		color = 'red';
	    }
	    $('#data').append(drawBars(parseInt(d[i].times[j].end - d[i].times[j].start)/2 + 'px', color));
	    if(j != d[i].times.length -1){
		$('#data').append(drawBars(parseInt(d[i].times[j+1].start - d[i].times[j].end)/2 + 'px', 'black'));
	    }else{
		$('#data').append(drawBars(parseInt(d[i].actualEnd - d[i].times[j].end)/2 + 'px', 'black'));
	    }
	}
	if(d[i].actualEnd < d[i].endTime){
	    $('#data').append(drawBars(parseInt(d[i].endTime - d[i].actualEnd)/2 + 'px', 'gold'));
	}


	$('#data').append("<br/>");

	c++;
    }
    $('#data').append("<br/>");    	

}

function generateEditGraph(d, itonly){

    if(!itonly){
    $('#data').append("What each HIT did with their edit (blue is itinerary, green is stream, red is both)" + "<br/>");
    }else{
	$('#data').append("What each HIT did with their itinerary edits, if any (green is add, red is remove, blue is reorder, gold is update an item, and black is same)" + "<br/>");
    }
    var c = 1;
    var moves = [];
    var mc = [];
    mc['add'] = 0;
    mc['remove'] = 0;
    mc['reorder'] = 0;
    mc['update'] = 0;
    mc['it'] = 0;
    mc['str'] = 0;
    mc['both'] = 0;
    var reorderonly = true;
    var mctotal = 0;
    var numReorder = 0;
    var numReorderHelp = 0;
    for(var i = 1; i < d.length ; i++){
	
	// // continue if only changed itinerary
	// if(typeof(d[i].type) != 'undefined' && d[i].type == 'str'){
	//     continue;
	// }
	// continue if still the same HIT
	    if(d[i].turkerId == 'A3RLCGRXA34GC0'){
//		if(d[i].type == 'str'){
		    continue;
//		}else if(d[i].type == 'both' && d[i].strchange == 'titledescription'){
//		    continue;
//		}
	    }

	
	if(!itonly){
	    moves.push(mapTypes(d[i].type));
	    mctotal++;
	    if(typeof(mc[d[i].type]) == 'undefined'){
		mc[d[i].type] = 1;
	    }else{
		mc[d[i].type] += 1;
	    }
	}else{
	    if(d[i].type != 'str'){
		// COMPRESS MULTIPLE CONSECTUIVE REORDERS INTO ONE
		if(i > 0 && d[i-1].assignmentId == d[i].assignmentId && d[i-1].itchange == "reorder" && d[i].itchange == "reorder"){
		    mc[d[i].itchange] -= 1;
		    mctotal--;
		}else{
		    moves.push(mapTypes(d[i].itchange));
		}
		if(d[i].itchange != 'reorder'){
		    reorderonly = false;
		}
		mctotal++;
		if(typeof(mc[d[i].type]) == 'undefined'){
		    mc[d[i].itchange] = 1;
		}else{
		    
		    mc[d[i].itchange] += 1;
		}
	    }
	}
	
	if(i < d.length - 1 && typeof(d[i].assignmentId) != 'undefined' && d[i].assignmentId == d[i+1].assignmentId){
	    continue;
	}

	$('#data').append(drawText('20px', c)); 
	for(var j = 0; j < moves.length; j++){
	    $('#data').append(drawBars(20 + 'px', moves[j]));
//	    $('#data').append(moves[j] + ";");
	}
	if(reorderonly && itonly && moves.length !=0){
	    numReorder++;
	    for(var k = i -1; k >= 0; k--){
		if(d[i].assignmentId != d[k].assignmentId){
		    if(d[k].tripTime > d[i].tripTime){
			numReorderHelp++;
		    }
		    break;
		}
	    }
//	    $('#data').append("YES");
	    
	}
	reorderonly = true;
	$('#data').append("<br/>");

	c++;
	moves = [];
    }
    
    if(itonly){
	$('#data').append("Add: " + mc['add'] + " (" + mc['add']/mctotal+ ")<br/>");
	$('#data').append("Remove: " + mc['remove'] + " (" + mc['remove']/mctotal + ")<br/>");
	$('#data').append("Reorder: " + mc['reorder'] + " (" + mc['reorder']/mctotal + ")<br/>");
	$('#data').append("Update: " + mc['update'] + " (" + mc['update']/mctotal + ")<br/>");
//	$('#data').append("Reorder only HIT shortened trip time: " + numReorderHelp + "/" + numReorder + "<br/>");
    }else{
	$('#data').append("Both: " + mc['both'] + " (" + mc['both']/mctotal + ")<br/>");
	$('#data').append("Itinerary: " + mc['it'] +  " (" + mc['it']/mctotal + ")<br/>");
	$('#data').append("Stream: " + mc['str'] + " (" + mc['str']/mctotal + ")<br/>");
    }
    $('#data').append("<br/>");    
}

function generateConstraintLifeHistogram(d, maxSize){
    var constraintBox = [];
    var numConstraints = 0;
    
    for(var i = 0; i < d.length ; i++){
	    if(d[i].turkerId == 'A3RLCGRXA34GC0'){
		if(d[i].type == 'str'){
		    continue;
		}else if(d[i].type == 'both' && d[i].strchange == 'titledescription'){
		    continue;
		}
	    }

//	if(!everyEdit){
	    if(i < d.length - 1 && typeof(d[i].assignmentId) != 'undefined' && d[i].assignmentId == d[i+1].assignmentId){
		continue;
	    }
//	}
	if(typeof(d[i].constraintStat) != 'undefined' && d[i].constraintStat.length != 0){
	    numConstraints = d[i].constraintStat.length;
	}
	for(var j = 0; j < d[i].constraintStat.length; j++){
//	    if(d[i].type == 'str'){
//		continue;
//	    }
	    if(d[i].constraintStat[j] > 0){
		if(typeof(constraintBox[j]) != 'undefined'){
		    constraintBox[j]+=1;
		}else{
		    constraintBox[j] = 1;
		}
	    }else{
		if(typeof(constraintBox[j]) != 'undefined'){
	
		    constraintLife.push(constraintBox[j]);
		    if(constraintBox[j] < maxSize){
			counts[constraintBox[j]]+=1;
		    }else{
			counts[maxSize-1]+=1;
		    }
		    delete constraintBox[j];
		}
	    }
	}
    }
//    return counts;
}

function generateConstraintGraph(d, everyEdit){
    if(!everyEdit){
	$('#data').append("Degree to which each constraint is violated (black is time constraint) from one HIT to the next<br/>");
    }else{
$('#data').append("Degree to which each constraint is violated (black is time constraint) from one edit to the next<br/>");
    }
    var c = 0;
    for(var i = 0; i < d.length ; i++){
	
	// // continue if only changed itinerary
	// if(typeof(d[i].type) != 'undefined' && d[i].type == 'str'){
	//     continue;
	// }
	// continue if still the same HIT
	if(!everyEdit){
	    if(i < d.length - 1 && typeof(d[i].assignmentId) != 'undefined' && d[i].assignmentId == d[i+1].assignmentId){
		continue;
	    }
	}
	
	// special logic for our clever friend
	if(d[i].turkerId == 'A3RLCGRXA34GC0'){
	    if(d[i].type == 'str'){
		continue;
	    }else if(d[i].type == 'both' && d[i].strchange == 'titledescription'){
		continue;
	    }
	}

	$('#data').append(drawText('20px', c)); 
	for(var j = 0; j < d[i].constraintStat.length; j++){

	    $('#data').append(drawBars(parseInt(d[i].constraintStat[j] * 50) + 'px', colorByNumber(j)));

//	    $('#data').append("," + d[i].constraintStat[j]);
	}

	if(d[i].timeStat !='undefined' && Math.abs(d[i].timeStat) >= 0.05){
//	    $('#data').append("," + Math.abs(d[i].timeStat));
	    $('#data').append(drawBars(parseInt(Math.abs(d[i].timeStat) * 50) + 'px', 'black'));
	}else{
//	    alert(d[i].timeStat);
	}
	$('#data').append("<br/>");

	c++;
    }
    $('#data').append("<br/>");    	
}

function constraintsGraph(){
    $('#data').html("");
    for(var i = 0; i < data.length; i++){
	$('#data').append("tid: " + data[i].tid + " (<b>" + tasks[data[i].tid]  +"</b>)<br/><br/>");
	generateConstraintGraph(data[i], false);
	$('#data').append("<hr/><br/>");    	
    }
}

function editGraphHIT(){
    $('#data').html("");
    for(var i = 0; i < data.length; i++){
	$('#data').append("tid: " + data[i].tid + " (<b>" + tasks[data[i].tid]  +"</b>)<br/><br/>");
	generateEditGraph(data[i], false);
	$('#data').append("<hr/><br/>");    	
    }
}

function editGraphItinerary(){
    $('#data').html("");
    for(var i = 0; i < data.length; i++){
	$('#data').append("tid: " + data[i].tid + " (<b>" + tasks[data[i].tid]  +"</b>)<br/><br/>");
	generateEditGraph(data[i], true);
	$('#data').append("<hr/><br/>");    	
    }
}
function itineraryGraph(){
    $('#data').html("");
    for(var i = 0; i < data.length; i++){
	$('#data').append("tid: " + data[i].tid + " (<b>" + tasks[data[i].tid]  +"</b>)<br/><br/>");
	generateItineraryGraph(data[i], false);
	$('#data').append("<hr/><br/>");    	
    }
}

function streamEditGraph(){
    $('#data').html("");
    for(var i = 0; i < data.length; i++){
	$('#data').append("tid: " + data[i].tid + " (<b>" + tasks[data[i].tid]  +"</b>)<br/><br/>");
	generateStreamEditGraph(data[i]);
	$('#data').append("<hr/><br/>");    	
    }
}

function generateStreamEditGraph(d){
    $('#data').append("Stream edit by type on a time scale from one HIT to the next (black is new idea, green is edit someone else's idea, red is edit own)<br/>");

    var moves = [];
    var c = 0;
    var mc = [];
    mc['new'] = 0;
    mc['editown'] = 0;
    mc['editelse'] = 0;
    var mctotal = 0;
    var strc = [];
    strc['duration'] = 0;
    strc['titledescription'] = 0;
    strc['location'] = 0;
    strc['categories'] = 0;
    strc['same'] = 0;
    var strctotal = 0;

    for(var i = 0; i < d.length ; i++){
	// // continue if only changed itinerary
	// if(typeof(d[i].type) != 'undefined' && d[i].type == 'str'){
	//     continue;
	// }
	// continue if still the same HIT
	
	if(d[i].turkerId == 'A3RLCGRXA34GC0'){
	    //		if(d[i].type == 'str'){
	    continue;
	    //		}else if(d[i].type == 'both' && d[i].strchange == 'titledescription'){
	    //		    continue;
//		}
	}
	if(d[i].type == 'str' || d[i].type == 'both'){
	    if(d[i].isNew){
		moves.push('black');
		mc['new']+=1;
		mctotal++;
	    }else if(typeof(d[i].createdBy) != 'undefined' && d[i].createdBy != d[i].turkerId){
		mc['editelse']+=1;
		moves.push('green');
		mctotal++;
	    }else if(typeof(d[i].createdBy) != 'undefined'){
		mc['editown']+=1;
		moves.push('red');
		mctotal++;
	    }else{

	    }
	    if(typeof(d[i].createdBy) != 'undefined' && !d[i].isNew){
		strc[d[i].strChange] += 1;
		strctotal++;		
	    }

	}
	 
	if(i < d.length - 1 && typeof(d[i].assignmentId) != 'undefined' && d[i].assignmentId == d[i+1].assignmentId){
	    continue;
	}

	$('#data').append(drawText('20px', c)); 
	for(var j = 0; j < moves.length; j++){
	    $('#data').append(drawBars(20 + 'px', moves[j]));
	    //	    $('#data').append(moves[j] + ";");
	}
	
	// for each one, print color for new activity, and color for edit your own vs 
	// edit someone else's
	
	$('#data').append("<br/>");

	c++;
	moves = [];
    }

	$('#data').append("New: " + mc['new'] + " (" + mc['new']/mctotal+ ")<br/>");
	$('#data').append("Edit another's: " + mc['editelse'] + " (" + mc['editelse']/mctotal + ")<br/>");
	$('#data').append("Edit own: " + mc['editown'] + " (" + mc['editown']/mctotal + ")<br/>");


    $('#data').append("<br/>");    	
    $('#data').append("Duration changed: " +     strc['duration'] + " (" +     strc['duration'] /strctotal + ")<br/>");
    $('#data').append("Title/Desc. changed: " +     strc['titledescription'] + " (" +     strc['titledescription'] /strctotal + ")<br/>");
    $('#data').append("Location changed: " +     strc['location'] + " (" +     strc['location'] /strctotal + ")<br/>");
    $('#data').append("Category changed: " +     strc['categories'] + " (" +     strc['categories'] /strctotal + ")<br/>");
    $('#data').append("No change: " +     strc['same'] + " (" +     strc['same'] /strctotal + ")<br/>");

    $('#data').append("<br/>");    	

}


function generateAllGraphs(){
    $('#data').html("");
    for(var i = 0; i < data.length; i++){
	$('#data').append("tid: " + data[i].tid + " (<b>" + tasks[data[i].tid]  +"</b>)<br/><br/>");
	generateConstraintGraph(data[i], false);
	generateEditGraph(data[i], false);
	generateEditGraph(data[i], true);
	generateStreamEditGraph(data[i]);
	generateItineraryGraph(data[i], false);
	$('#data').append("<hr/><br/>");    	
    }
}

var counts;
var maxSize = 21;
counts = [];
for(var k = 0; k < maxSize; k++){
    counts[k] = 0;
}
var constraintLife;

function lifeHistogram(){

    constraintLife = [];
    for(var i = 0; i < data.length; i+=2){
//	$('#data').append("tid: " + data[i].tid + " (<b>" + tasks[data[i].tid]  +"</b>)<br/><br/>");
	generateConstraintLifeHistogram(data[i], maxSize);
    }
 //   for(var k = 0; k < constraintLife.length; k++){
//	$('#data').append(constraintLife[k] + "<br/>");
 // }

    var run = 0;
    var total = 0;
    for(var k = 1; k < maxSize; k++){
	total += counts[k];
    }
    $('#data').append("Cumulative Histogram of Lifetime of a constraint (in # of HITs) for TODO condition<br/><br/>");

    for(var k = 1; k < maxSize; k++){
	if(k != maxSize - 1){
//	$('#data').append(drawText('20px', k)); 
	}else{
//	    $('#data').append(drawText('20px', k + '+')); 
	}
	run += counts[k]; 	
//	$('#data').append(drawBars(parseInt((run / total) * 200)+ 'px', 'blue'));
	$('#data').append( run / total);

	$('#data').append("<br/>");    	  
    }
    $('#data').append("<hr/><br/>");    	  

    counts = [];
    for(var k = 0; k < maxSize; k++){
	counts[k] = 0;
    }

    constraintLife = [];
    for(var i = 1; i < data.length; i+=2){
	$('#data').append("tid: " + data[i].tid + " (<b>" + tasks[data[i].tid]  +"</b>)<br/><br/>");
	generateConstraintLifeHistogram(data[i], maxSize);
    }

//    for(var k = 0; k < constraintLife.length; k++){
//	$('#data').append(constraintLife[k] + "<br/>");
//  }

    $('#data').append("Cumulative Histogram of Lifetime of a constraint (in # of HITs) for NO-TODO condition<br/><br/>");
    run = 0;
    total = 0;
    for(var k = 1; k < maxSize; k++){
	total += counts[k];
    }

    for(var k = 1; k < maxSize; k++){
	if(k != maxSize - 1){
//	$('#data').append(drawText('20px', k)); 
	}else{
//	    $('#data').append(drawText('20px', k + '+')); 
	}

	run += counts[k]; 	
//	$('#data').append(drawBars(parseInt((run / total) * 200)+ 'px', 'blue'));
	$('#data').append(run / total);
//	$('#data').append(drawBars(parseInt(counts[k] * 0.5)+ 'px', 'blue'));
	$('#data').append("<br/>");    	  
    }
    $('#data').append("<hr/><br/>");    	  

}

$(document).ready(function(jQuery) {
    loadExperimentFrames();
    lifeHistogram();
//	generateConstraintGraph(data[i], true);

    $('#data').append(JSON.stringify(data[1]));
//    alert(data.length);
});