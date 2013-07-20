<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";


function getRealIpAddr()
{ 
  if (!empty($_SERVER['HTTP_CLIENT_IP'])) //check ip from share internet 
    { $ip=$_SERVER['HTTP_CLIENT_IP']; } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) //to check ip is pass from proxy 
{ $ip=$_SERVER['HTTP_X_FORWARDED_FOR']; } else { $ip=$_SERVER['REMOTE_ADDR']; } return $ip; } 

error_reporting(0);

include('Mail.php');
include('Mail/mime.php');

// check the guy has an account with us



mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");


$name = mysql_real_escape_string($_POST['assignmentId']);
$email = mysql_real_escape_string(getRealIpAddr());
$taskId = mysql_real_escape_string($_POST['taskId']);
$userId = mysql_real_escape_string($_POST['userId']);
$query = "INSERT INTO turktour_users_$taskId (userId, name, email, information) VALUES ('$userId', '$name', '$email', now())";
mysql_query($query);

 mysql_close();
?>