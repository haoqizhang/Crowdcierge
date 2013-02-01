<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";





mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$userId = $_POST["userId"];
$answer = $_POST["answer"];
$taskId = $_POST["taskId"];
$type =  $_POST["type"];
$startState = $_POST["startState"];


if(strcmp("tour", $type) == 0){
  $userId = mysql_real_escape_string($userId);
  $taskId = mysql_real_escape_string($taskId);

  /// check if tour has changed since state is loaded
  $squery = "SELECT * from tour_state_$taskId ORDER BY stateId DESC LIMIT 1";
  $results = mysql_query($squery);
  if(mysql_num_rows($results) != 0){
    while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
      $lastid = $row['stateId'];
      $lastuid = $row['userId'];
      if($startState != $lastid && $userId != $lastuid){
	// state has changed since you came, and you weren't the last one to 
	// touch it
	return null;
      }
    }
  }


  // check that there are no inconsistencies
  // decode answer
  $aj = json_decode($answer, true);
  $aj = $aj['itinerary'];
  $func = function($value){
    return substr($value, 5);
  };
  $item_ids = array_map($func, $aj);
  $string = implode(',', $item_ids);
  
  $checkquery = "SELECT * FROM tour_$taskId where hitId in ($string) and changeInfo IS NOT NULL";

  $checkresult = mysql_query($checkquery); 
  if(mysql_num_rows($checkresult) != 0){ 
    return; 
  } 

  // no inconsistencies, can continue
  $answer = mysql_real_escape_string($answer);
  $query = "INSERT INTO tour_state_$taskId (state, userId, submitTime) VALUES ('$answer', '$userId', now())";
   
  if(!mysql_query($query)){
    echo  mysql_error();
  }else{
    echo mysql_insert_id();
  }
}

mysql_close();
?>
  


