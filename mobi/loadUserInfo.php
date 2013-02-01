<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";




mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$userId = $_GET['userId'];
$taskId = $_GET['taskId'];


  $query = "SELECT * FROM potluck_users_$taskId where userId='$userId'";
  //  echo $query;
  $results = mysql_query($query);

if(!$results){
  return null;
}else{
  if(mysql_num_rows($results) == 0){
    // no history
    return null;
  }else{  
  while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
    // assume just one element...
    echo json_encode($row);
  }
  }
}
mysql_close();
?>

