<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";




mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$id = $_GET['id'];

if($id != 'null'){
  // Update the state
  // read latest state information
  $squery = "SELECT * from turktour_state_$id";
  $results = mysql_query($squery);
  if(mysql_num_rows($results) == 0){
    // no history
    return null;
  }else{

    $arr = array();
    
    
    while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
      array_push($arr, $row);
      
    }
    echo json_encode($arr);  
  }
  
  
}else{ // TODO: look up what hits are available
}
mysql_close();
?>

