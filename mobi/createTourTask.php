<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";






mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$type = mysql_real_escape_string($_POST["type"]);
$name = mysql_real_escape_string($_POST["activity"]);
$description = mysql_real_escape_string($_POST["description"]);
$categories = mysql_real_escape_string($_POST["categories"]);
$constraints = mysql_real_escape_string($_POST["constraints"]);
$start = mysql_real_escape_string($_POST["start"]);
$end = mysql_real_escape_string($_POST["end"]);
$beginTime = intval($_POST["beginTime"]);
$endTime = intval($_POST["endTime"]);
$creator = mysql_real_escape_string($_POST["creator"]);


$id = md5($name . rand());

if(strcmp("tour", $type) == 0){
  // create task entry in task list
  $query = "INSERT INTO tour_tasks (id, name, description, categories, constraints, start, end, beginTime, endTime, createTime, status, creator) VALUES ('$id', '$name', '$description', '$categories', '$constraints', '$start', '$end', $beginTime, $endTime, now(), 'open', '$creator')";
  mysql_query($query);
  echo  mysql_error();

  // create a generic table for work done for the task

  $tquery = "CREATE TABLE tour_$id (hitId mediumint PRIMARY KEY NOT NULL AUTO_INCREMENT, userId char(32), answer text, submitTime datetime, changeInfo text, UNIQUE(hitId))";
  mysql_query($tquery);
  echo  mysql_error();

  // create a table for people who we want to pre-register for the 
  // task --- register others automatically as we go...
  $rquery = "CREATE TABLE tour_users_$id (userId char(32), name varchar(128), email varchar(128), information text)";
  mysql_query($rquery);
  echo  mysql_error();

 // create a table for the program's state
  $squery = "CREATE TABLE tour_state_$id (stateId mediumint PRIMARY KEY NOT NULL AUTO_INCREMENT, state mediumtext, userId char(32), submitTime datetime, changeInfo text, UNIQUE(stateId))";
   mysql_query($squery);
  echo  mysql_error();

  // insert the host's info and create initial state
  $state = array();
  $state['itinerary'] = array();
  $state['stream'] = array();
  $state['admin']['id'] = $id;
  $state['admin']['type'] = $_POST["type"];
  $state['admin']['name'] = $_POST["activity"];
  $state['admin']['description'] = $_POST["description"];
  $state['admin']['categories'] = json_decode($_POST["categories"]);
  $state['admin']['constraints'] = json_decode($_POST["constraints"]);
  $state['admin']['start'] = json_decode($_POST["start"]);
  $state['admin']['end'] = json_decode($_POST["end"]);
  $state['admin']['beginTime'] = $beginTime;
  $state['admin']['endTime'] = $endTime;
  $state['admin']['status'] = 'open';
  $state['admin']['creator'] = $_POST["creator"];
  $stateAct =  mysql_real_escape_string(json_encode($state));
  echo $stateAct;
  $wquery = "INSERT INTO tour_state_$id (state, submitTime) VALUES ('$stateAct', now())";
  //echo $wquery;
  mysql_query($wquery);
  echo  mysql_error();

}

mysql_close();

?>