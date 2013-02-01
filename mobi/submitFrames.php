<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";





mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$answer = urldecode($_POST["answer"]);
$taskId = $_POST["taskId"];

$taskId = mysql_real_escape_string($taskId);
$answer = mysql_real_escape_string($answer);


// see if allowed to make change
$checkq = "SELECT * FROM turktour_frames where tid='$taskId'";
$checkresult = mysql_query($checkq);
$query = "";

if(mysql_num_rows($checkresult) != 0) {
  // can't update, conflicts with another edit someone already made.
  $query = "UPDATE turktour_frames SET answer = '$answer' WHERE tid='$taskId'";
}else{
  $query = "INSERT INTO turktour_frames (tid, answer, submitTime) VALUES ('$taskId', '$answer', now())";
}


$results = mysql_query($query);
  echo  mysql_error();