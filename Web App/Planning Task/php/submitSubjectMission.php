<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";





mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$userId = $_POST["userId"];
$taskId = $_POST["taskId"];
$type =  $_POST["type"];
$description = $_POST["description"];
$constraints = $_POST["constraints"];
$categories = $_POST["categories"];

//$startState = $_POST["startState"];


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

      $aj['admin']['description'] = $description;
      $aj['admin']['constraints'] = json_decode($constraints, true);
      $aj['admin']['categories'] =  json_decode($categories, true);
      $newstate = mysql_real_escape_string(json_encode($aj));
      $newquery = "INSERT INTO tour_state_$taskId (state, userId, submitTime, changeInfo) VALUES ('$newstate', '$userId', now(), 'mission')";
      mysql_query($newquery);
      //     echo mysql_error();
    }
  }

  /// check if there are changes needed to current itinerary to include such items
  $tsquery = "SELECT * from turktour_state_$taskId ORDER BY stateId DESC LIMIT 1";
  $tresults = mysql_query($tsquery);
  if(mysql_num_rows($tresults) == 0){
    // no history
    return;
  }else{
    while($row = mysql_fetch_array($tresults, MYSQL_ASSOC)) {
      $aj = json_decode($row['state'], true);
      $aj['admin']['description'] = $description;
      $aj['admin']['constraints'] = json_decode($constraints, true);
      $aj['admin']['categories'] =  json_decode($categories, true);
  
      $tnewstate = mysql_real_escape_string(json_encode($aj));
      $tnewquery = "INSERT INTO turktour_state_$taskId (state, userId, submitTime, changeInfo) VALUES ('$tnewstate', '$userId', now(), 'mission')";
      mysql_query($tnewquery);
      //     echo mysql_error();
    }
  }

}


mysql_close();
?>
  


