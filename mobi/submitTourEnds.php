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
$start = $_POST["start"];
$beginTime = intval($_POST["beginTime"]);
$startState = $_POST["startState"];
$end = $_POST["end"];
$endTime = intval($_POST["endTime"]);

if(strcmp("tour", $type) == 0){
  $userId = mysql_real_escape_string($userId);
  $taskId = mysql_real_escape_string($taskId);

  /// check if there are changes needed to current itinerary to include such items
  $squery = "SELECT * from tour_state_$taskId ORDER BY stateId DESC LIMIT 1";
  $results = mysql_query($squery);
  if(mysql_num_rows($results) == 0){
    // no history
    return;
  }else{
    while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
      $aj = json_decode($row['state'], true);
      $aj['admin']['start'] = json_decode($start, true);
      $aj['admin']['beginTime'] = $beginTime;
      $aj['admin']['end'] = json_decode($end, true);
      $aj['admin']['endTime'] = $endTime;

      $newstate = mysql_real_escape_string(json_encode($aj));
      $newquery = "INSERT INTO tour_state_$taskId (state, userId, submitTime, changeInfo) VALUES ('$newstate', '$userId', now(), 'start')";
      mysql_query($newquery);
      //     echo mysql_error();
    }
  }
}


mysql_close();
?>
  


