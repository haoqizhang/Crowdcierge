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
$hitId = $_POST["id"];

if(strcmp("tour", $type) == 0){

  $userId = mysql_real_escape_string($userId);
  $taskId = mysql_real_escape_string($taskId);
  $answer = mysql_real_escape_string($answer);
  $hitId = mysql_real_escape_string($hitId);  
  // see if allowed to make change
  $check = "SELECT * FROM tour_$taskId where hitId=$hitId and changeInfo IS NOT NULL";
  $checkresult = mysql_query($check);
  echo mysql_error();
  if(mysql_num_rows($checkresult) != 0) {
    // can't update, conflicts with another edit someone already made.
    return;    
  }

  $query = "UPDATE tour_$taskId SET answer='$answer' WHERE hitId=$hitId";
  
  if(!mysql_query($query)){
    //    echo  mysql_error();
  }else{
    //  echo mysql_insert_id();
  }
}

mysql_close();
?>
  


