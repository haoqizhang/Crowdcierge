<?php
header('Access-Control-Allow-Origin: *');




mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$userId = $_POST["userId"];
$answer = $_POST["answer"];
$taskId = $_POST["taskId"];
$type =  $_POST["type"];

if($userId == 'null'){
  $answerJson = json_decode($answer, true);
  $name = $answerJson['name'];
  $email = $answerJson['email'];
  $userId = md5($name . $email);
}

$hitId = md5($userId . rand());


if(strcmp("potluck", $type) == 0){

  // echo $answer; 
  // pre-process entry
  // 1. turn answer into json
  echo $answer;
  $aj = json_decode($answer, true);
 

  // 2a. assign user id to answer
  $aj['userId'] = $userId;

  foreach ($aj['choices'] as &$value) {
    if($value['id'] == null){
      $value['id'] = md5($value['description'] . rand());
    }
  }

  foreach ($aj['preferences'] as &$value) {
    if($value['id'] == null){
      $value['id'] = md5($value['description'] . rand());
    }
  }

  $answer = json_encode($aj);


  // escape strings
  $userId = mysql_real_escape_string($userId);
  $answer = mysql_real_escape_string($answer);
  $taskId = mysql_real_escape_string($taskId);
  $type =  mysql_real_escape_string($type);
  
  // create entry in this tasks' entry list
  $query = "INSERT INTO potluck_$taskId (hitId, userId, answer, submitTime) VALUES ('$hitId', '$userId', '$answer', now())";
     mysql_query($query);
  //    echo $query;
  echo  mysql_error();

  // Update the state
  // read latest state information
  $squery = "SELECT * FROM potluck_state_$taskId ORDER BY stateId DESC LIMIT 1";
  $results = mysql_query($squery);

  while($row = mysql_fetch_array($results)) {
    $state = json_decode($row['state'], true);
    $found = false;
    foreach ($state['users'] as &$user) {
      if($user['userId'] == $userId){
	$user =  $aj;
	$found = true;
	break;
      }
    }
    if(!$found){
      array_push($state['users'], $aj);
    }

    // Preference ordering
    // 1. take new preference ordering given

      // 2. add new things in last state into my ordering
      foreach ($state['preferenceOrdering'] as $v2) {
	$new = true;
	foreach ($aj['preferenceOrdering'] as $inorder) {
	  if($inorder['id'] == $v2['id']){
	    $new = false;
	    break;
	  }
	}
	if($new && $v2['userId'] != $userId){// add it to the front
	  array_unshift($aj['preferenceOrdering'], $v2);
	}
      }


    // 3. add new things to my ordering now that they are labeled
      foreach ($aj['preferences'] as $v2) {
	$new = true;
	foreach ($aj['preferenceOrdering'] as $inorder) {
	  if($inorder['id'] == $v2['id']){
	    $new = false;
	    break;
	  }
	}
	if($new){// add it to the front
	  array_unshift($aj['preferenceOrdering'], array('id' => $v2['id'], 'userId' => $userId));
	}
      }

      $state['preferenceOrdering'] = $aj['preferenceOrdering'];
      
      $state =  mysql_real_escape_string(json_encode($state));
      $squery = "INSERT INTO potluck_state_$taskId (state, hitId, userId, submitTime) VALUES ('$state', '$hitId', '$userId', now())";
      
          mysql_query($squery);
      // echo $squery;
      echo  mysql_error();
      
  }
  
}
mysql_close();
?>
  


