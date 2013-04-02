<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";




mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");
//mysql_set_charset('UTF8');

$id = $_GET['id'];

if($id != 'null'){
  $query = "SELECT * FROM turktour_$id";
  $results = mysql_query($query);

  $arr = array();
  while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
	echo $row;
	echo $row['answer'];
    array_push($arr, $row);
  }
  echo json_encode($arr);
}else{ // TODO: look up what hits are available
}
mysql_close();
?>

