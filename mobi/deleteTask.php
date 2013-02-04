<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";




mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$type = $_POST["type"]; 
$id = $_POST["id"];


if(strcmp("potluck", $type) == 0){
  
  $query = "DELETE FROM potluck_tasks where id='$id'";

  mysql_query($query);
  echo $query;
  echo  mysql_error();

  $tquery = "DROP TABLE potluck_$id";
  mysql_query($tquery);
  echo $tquery;
  echo  mysql_error();

  $squery = "DROP TABLE potluck_state_$id";
  mysql_query($squery);
  echo $squery;
  echo  mysql_error();

  $uquery = "DROP TABLE potluck_users_$id";
  mysql_query($uquery);
  echo $uquery;
  echo  mysql_error();

  $rquery = "DROP TABLE potluck_request_$id";
  mysql_query($rquery);
  echo $rquery;
  echo  mysql_error();

  $tequery = "DROP TABLE potluck_experiment_$id";
  mysql_query($tequery);
  echo $tequery;
  echo  mysql_error();

  $sequery = "DROP TABLE potluck_experiment_state_$id";
  mysql_query($sequery);
  echo $sequery;
  echo  mysql_error();
}

mysql_close();

?>