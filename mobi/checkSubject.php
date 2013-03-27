<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";




mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");
$id = mysql_real_escape_string($_GET["id"]);

$query = "SELECT * FROM tour_subjects WHERE id='$id'";
$results = mysql_query($query);

if(mysql_num_rows($results) == 0){
  return;
}

while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
  echo json_encode($row);
}
mysql_close();
?>
