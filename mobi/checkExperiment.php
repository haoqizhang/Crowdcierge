<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";




mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$uid = $_GET['userId'];
$tid = $_GET['taskId'];

$query = "SELECT * FROM potluck_experiment_$tid where userId='$uid'";
$results = mysql_query($query);
if(!$results){
  echo "false";
}else if(mysql_num_rows($results) == 0){
  return null;
}else{
  echo "found";
}

mysql_close();

?>

