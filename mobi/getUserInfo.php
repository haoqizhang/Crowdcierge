<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";

mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$email = $_GET['email'];

if($email != 'null'){
	// Update the state
	// read latest state information
	$squery = "SELECT * from tour_subjects WHERE email='$email'";
	$results = mysql_query($squery);
	if(mysql_num_rows($results) == 0){
		echo 'no user found';
	}else{
		$row = mysql_fetch_array($results, MYSQL_ASSOC);
		echo json_encode($row);
    }

}else{
	echo 'ERROR: no email specified';
}
mysql_close();
?>