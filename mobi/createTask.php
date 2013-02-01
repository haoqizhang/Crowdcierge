<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";





mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$type = mysql_real_escape_string($_POST["type"]);
$name = mysql_real_escape_string($_POST["activity"]);
$description = mysql_real_escape_string($_POST["description"]);
$categories = mysql_real_escape_string($_POST["categories"]);
$constraints_verbal = mysql_real_escape_string($_POST["verbal"]);
$id = md5($name . rand());


if(strcmp("potluck", $type) == 0){
  // create task entry in task list
  $query = "INSERT INTO potluck_tasks (id, name, description, categories, constraints_verbal, createTime, status) VALUES ('$id', '$name', '$description', '$categories', '$constraints_verbal', now(), 'open')";
  mysql_query($query);
  //  echo $query;
  echo  mysql_error();

  // create a generic table for work done for the task
  $tquery = "CREATE TABLE potluck_$id (hitId char(32), userId char(32), answer text, submitTime datetime)";
  mysql_query($tquery);
  echo  mysql_error();

  // create a table for requests
  $qquery = "CREATE TABLE potluck_request_$id (stateId mediumint, userId char(32), toId char(32), item text, message text, submitTime datetime)";
  mysql_query($qquery);
  echo  mysql_error();

  // create a table for people who we want to pre-register for the 
  // task --- register others automatically as we go...
  $rquery = "CREATE TABLE potluck_users_$id (userId char(32), name varchar(128), email varchar(128), information text)";
   mysql_query($rquery);
  echo  mysql_error();

 // create a table for the program's state
  $squery = "CREATE TABLE potluck_state_$id (stateId mediumint PRIMARY KEY NOT NULL AUTO_INCREMENT, state mediumtext, hitId char(32), userId char(32), submitTime datetime, changeInfo text, UNIQUE(stateId))";
   mysql_query($squery);
  echo  mysql_error();

  // add users to user table
  $f = fopen("potluck.csv", "r");
  while (!feof($f)) {
    $line = rtrim(fgets($f));
    $in = explode(',', $line); // time, name, guests, email
    $name = rtrim($in[0]);
    $guests = rtrim($in[1]);
    $email = rtrim($in[2]);
    $userId = md5($name . $email);
    $usersquery = "INSERT INTO potluck_users_$id (userId, name, email, information) VALUES ('$userId', '$name', '$email', '$guests')";
    mysql_query($usersquery);
  }
  fclose($f);

  // insert the host's info and create initial state
  $state = array();
  $state['users'] = array();
  $state['preferenceOrdering'] = array();
  $state['admin']['id'] = $id;
  $state['admin']['type'] = $_POST["type"];
  $state['admin']['name'] = $_POST["activity"];
  $state['admin']['description'] = $_POST["description"];
  $state['admin']['categories'] = json_decode($_POST["categories"]);
  $state['admin']['preferences'] = json_decode($_POST["verbal"]);
  $state['admin']['status'] = 'open';
  
  $stateAct =  mysql_real_escape_string(json_encode($state));
  echo $stateAct;
  $wquery = "INSERT INTO potluck_state_$id (state, submitTime) VALUES ('$stateAct', now())";
  //echo $wquery;
  mysql_query($wquery);
  echo  mysql_error();

  ////////////////////
  ///////// Experiment stuff
  ////////////////////
  $t2query = "CREATE TABLE potluck_experiment_$id (hitId char(32), userId char(32), answer text, submitTime datetime)";
  mysql_query($t2query);
  echo  mysql_error();
  
  $s2query = "CREATE TABLE potluck_experiment_state_$id (stateId mediumint PRIMARY KEY NOT NULL AUTO_INCREMENT, state mediumtext, hitId char(32), userId char(32), submitTime datetime, changeInfo text, UNIQUE(stateId))";
  mysql_query($s2query);
  echo  mysql_error();

  $experimentState = array();
  $experimentState['seeNothing'] = $state;
  $experimentState['seeItems'] = $state;
  $experimentState['seeAll'] = $state;
  $experimentAct = mysql_real_escape_string(json_encode($experimentState));
  $exquery = "INSERT INTO potluck_experiment_state_$id (state, submitTime) VALUES ('$experimentAct', now())";
  mysql_query($exquery);
  echo  mysql_error();


}
mysql_close();

?>