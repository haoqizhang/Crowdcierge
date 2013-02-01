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
$assignmentId = $_POST["assignmentId"];


if(strcmp("turktour", $type) == 0){
  $userId = mysql_real_escape_string($userId);
  $answer = mysql_real_escape_string($answer);
  $taskId = mysql_real_escape_string($taskId);
  $assignmentId = mysql_real_escape_string($assignmentId);
  $query = "INSERT INTO turktour_$taskId (userId, assignmentId, answer, submitTime) VALUES ('$userId', '$assignmentId', '$answer', now())";
  if(!mysql_query($query)){
    echo  mysql_error();
  }else{
    echo mysql_insert_id();
  }
}

mysql_close();
?>