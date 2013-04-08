var 
	PING_ENDPOINT = 'http://crowdy.csail.mit.edu:4444/ping/',
	WORK_ENDPOINT = 'http://crowdy.csail.mit.edu:4444/gettask/',
	PING_INTERVAL = 2500,
	WORK_INTERVAL = 1000

var Retainer = {
	aid: null,
	wid: null,
	hid: null,
    sid: null,
	ping_type: 'waiting',
	
	init: function(worker_id, assignment_id, hit_id, submit_to){
		Retainer.aid = assignment_id;
		Retainer.wid = worker_id;
		Retainer.hid = hit_id;
		Retainer.sid = submit_to;
		
		Retainer.ping(worker_id, assignment_id, hit_id, Retainer.ping_type)
		Retainer.checkForWork(assignment_id)
	},
	
	ping: function(worker_id, assignment_id, hit_id, ping_type){
		$.get(PING_ENDPOINT + 
			'worker/' + worker_id + '/assignment/' + assignment_id + '/hit/' + hit_id + '/event/' + ping_type, 
			function(data, status){
				console.log('pong', data)
				setTimeout(Retainer.ping, PING_INTERVAL, worker_id, assignment_id, hit_id, Retainer.ping_type)
			}
		)
	},
	
	checkForWork: function(assignment_id){
		$.ajax({
			url: WORK_ENDPOINT + 'assignment/' + assignment_id, 
			success: function(data, status){
                if (data.start == undefined && data != "Bad assignment") {
                    data = JSON.parse(data);
                }
                
				if(data.start === true){
					Retainer.ping_type = 'working'
					Retainer.hasWork(data)
				} else {
					setTimeout(Retainer.checkForWork, WORK_INTERVAL, assignment_id)
				}
				console.log(data)
			} 
		})
	},
	
	hasWork: function(data){
        window.location.replace("http://people.csail.mit.edu:1111/main_ret_test.html?assignmentId="+aid+"&hitId="+hid+"&workerId="+wid+"&turkSubmitTo="+sid+"&bonus="+bonus+"&workId="+data.work_req_id);
	}
}