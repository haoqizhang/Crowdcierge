<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";




mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$id = $_GET['id'];


if($id != 'null'){
  $query = "SELECT * FROM potluck_tasks where id='$id'";
  //  echo $query;
  $results = mysql_query($query);
  
  while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
    //  $activity = $row['name'];
    // $description = $row['description'];
    // $categories = $row['categories'];
    // $status = $row['status'];
    
    // assume just one element...
    echo json_encode($row);
  }
  
}else{ // TODO: look up what hits are available
}
mysql_close();
?>

