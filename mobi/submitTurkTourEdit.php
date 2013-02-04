<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";





mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$userId = $_POST["userId"];
$answer = $_POST["answer"];
$taskId = $_POST["taskId"];
$type =  $_POST["type"];
$oldid = $_POST['oldid'];
$oldidstr = 'user_'. $oldid;
$assignmentId = $_POST["assignmentId"];


if(strcmp("turktour", $type) == 0){

  $userId = mysql_real_escape_string($userId);
  $oldid = mysql_real_escape_string($oldid);
  $taskId = mysql_real_escape_string($taskId);
  $answer = mysql_real_escape_string($answer);
  $assignmentId = mysql_real_escape_string($assignmentId);

  // see if allowed to make change
  $check = "SELECT * FROM turktour_$taskId where hitId=$oldid and changeInfo IS NOT NULL";
  $checkresult = mysql_query($check);
  if(mysql_num_rows($checkresult) != 0) {
    // can't update, conflicts with another edit someone already made.
    return;    
  }


  // okay, let's now add the thing
  $addquery = "INSERT INTO turktour_$taskId (userId, assignmentId, answer, submitTime) VALUES ('$userId', '$assignmentId', '$answer', now())";
  
  if(!mysql_query($addquery)){
    //    echo  mysql_error();
  }else{
    $newid = mysql_insert_id();  
    echo mysql_insert_id();
  }

  // update it on the item
  $query = "UPDATE turktour_$taskId SET changeInfo = $newid WHERE hitId=$oldid";
  
  if(!mysql_query($query)){
    //    echo  mysql_error();
  }else{
    //  echo mysql_insert_id();
  }
}

/// check if there are changes needed to current itinerary to include such items
$squery = "SELECT * from turktour_state_$taskId ORDER BY stateId DESC LIMIT 1";
$results = mysql_query($squery);
if(mysql_num_rows($results) == 0){
  // no history
  return;
}else{
  while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
      // assume just one element...
    // 1. access row to get itinerary portion
    // 2. decode itinerary portion
    // 3. 
    $aj = json_decode($row['state'], true);
    
    $changed = false;
    foreach ($aj['itinerary'] as &$value) {
      if($value == $oldidstr){
	$value = "user_" . $newid;
	$changed =true;
	break;
      }
    }
    if($changed){
      $newstate = mysql_real_escape_string(json_encode($aj));
      $oldidstr = mysql_real_escape_string($oldidstr);
      $newquery = "INSERT INTO turktour_state_$taskId (state, userId, assignmentId, submitTime, changeInfo) VALUES ('$newstate', '$userId', '$assignmentId', now(), '$oldidstr')";
     mysql_query($newquery);
     //     echo mysql_error();
    }
  }
}
mysql_close();
?>
  


