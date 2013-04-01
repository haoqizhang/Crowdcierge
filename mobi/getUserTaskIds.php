<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";

mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$uid = $_GET['uid'];

if($uid != 'null'){
	// Update the state
	// read latest state information
	$squery = "SELECT tid from crowdcierge_tasks WHERE uid='$uid'";
	$results = mysql_query($squery);
	if(mysql_num_rows($results) == 0){
		echo 'no tasks found';
	} else {
		$i = 0;
		while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
			$tasks[$i] = $row;
			$i += 1;
		}
		echo $tasks;
	}

}else{
	echo 'ERROR: no uid specified';
}
mysql_close();
?>