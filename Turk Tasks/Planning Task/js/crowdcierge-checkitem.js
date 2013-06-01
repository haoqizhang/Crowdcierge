///////////////////////////////////////////
// CHECK ITEM CODE
///////////////////////////////////////////

// Creates a check item from a stream item object
function createCheckItem(id, si) {
    var item = $(document.createElement('tr'));
    item.addClass(si.type);

    var msg = $(document.createElement('td'));
    msg.css('width', '100%');
    msg.append('<b>' + si.data.name + '</b>');
    msg.append('<br/>');
    
    //var desc = takeTill(si.data.description, 150);
    var desc = si.data.description.split('<ul')[0];
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
	tt.text("!!");
    time.append(tt);
    item.append(msg);
    item.append(time);

    $(item).click(function () {
        viewCheck(si);
    });
    
    $(item).attr('id', 'stream_' + si.id);
    $(id).prepend(item);
    
    //checkItems[si.id] = si;
    //saveCheckItems();
}

// View a checked item in the overlay box
function viewCheck(si) {
    $('#box').css('left', '30%');
    $('#box').css('right', '30%');

    $('#addActivity').hide();
    $('#addNote').hide();
    $('#viewCheck').show();
    $('#viewActivity').hide();
    $('#viewNote').hide();
	
    $('#viewcheckdesc').html(si.data.description);
	$('#viewchecklist').html(si.requestCheck);
    
    $('#overlay').fadeIn('fast', function () {
        $('#box').animate({
            'top': '20px'
        }, 500);
    });
    
    $("#resolvebutton").unbind("click");
    $("#resolvebutton").click(function() {
        si.onResolve()
    });
	
	if (isTask) {
		$("#gotit").show();
		$(".resolveSelect").hide();
	} else {
		$("#gotit").hide();
		$(".resolveSelect").show();
	}

	$('#viewchecklist').hide();
	$('#viewcheckdesc').show();
	
	$('.submitCheck').click(function() {
		if( $('.submitCheck').filter(':not(:checked)').length === 0){
			$(".resolveSelect").show();
		} else {
			$(".resolveSelect").hide();
		}
	});
}

// Save current check item state
function saveCheckItems() {
    state.checkItems = checkItems;

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