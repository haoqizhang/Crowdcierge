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
$hitId = md5($userId . rand());


if(strcmp("potluck", $type) == 0){
  $aj = json_decode($answer, true);
  $aj['userId'] = $userId;

  foreach ($aj['seeNothing']['choices'] as &$value) {
    if($value['id'] == null){
      $value['id'] = md5($value['description'] . rand());
    }
  }

  foreach ($aj['seeItems']['choices'] as &$value) {
    if($value['id'] == null){
      $value['id'] = md5($value['description'] . rand());
    }
  }

  foreach ($aj['seeAll']['choices'] as &$value) {
    if($value['id'] == null){
      $value['id'] = md5($value['description'] . rand());
    }
  }

  foreach ($aj['seeAll']['preferences'] as &$value) {
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
  
  // create entry in this tasks' entry list for experiment
  $query = "INSERT INTO potluck_experiment_$taskId (hitId, userId, answer, submitTime) VALUES ('$hitId', '$userId', '$answer', now())";
  mysql_query($query);
  echo  mysql_error();

  // Update the state
  // read latest state information
  $squery = "SELECT * FROM potluck_experiment_state_$taskId ORDER BY stateId DESC LIMIT 1";
  $results = mysql_query($squery);

  while($row = mysql_fetch_array($results)) {
    $state = json_decode($row['state'], true);
    echo json_encode($state);
    array_push($state['seeNothing']['users'], $aj['seeNothing']);
    array_push($state['seeItems']['users'], $aj['seeItems']);
    array_push($state['seeAll']['users'], $aj['seeAll']);

    echo $state;
    $state =  mysql_real_escape_string(json_encode($state));
    $squery = "INSERT INTO potluck_experiment_state_$taskId (state, hitId, userId, submitTime) VALUES ('$state', '$hitId', '$userId', now())";

    mysql_query($squery);
    echo  mysql_error();
  }
}
mysql_close();
?>
  


