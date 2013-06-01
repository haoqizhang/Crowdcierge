<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";




mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$taskId = "13aed5dbb9e8c495a5ef7a9367c19fa3";



$name = 'HQtest';
$name = mysql_real_escape_string($name);
$guests = 'None';
$email = 'zhang25@fas.harvard.edu';
$email = mysql_real_escape_string($email);
$userId = md5($name . $email);

$query = "INSERT INTO potluck_users_$taskId (userId, name, email, information) VALUES ('$userId', '$name', '$email', '$guests')";

 mysql_query($query);
//echo $query;
//   echo  mysql_error();


mysql_close();
