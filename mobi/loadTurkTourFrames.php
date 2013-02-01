<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";




mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$query = "SELECT * FROM turktour_frames";
  $results = mysql_query($query);
  $arr = array();
  while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
    array_push($arr, $row);
  }
  echo json_encode($arr);

mysql_close();
?>

