<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";

// usr/bin/pear
require_once "Mail.php";

// check the guy has an account with us


$database = "mobi";
mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");
$server = "http://people.csail.mit.edu/hqz/mobi/potluck.html";


$email = 'mamacheese@gmail.com';
$taskId = '13aed5dbb9e8c495a5ef7a9367c19fa3';

if($taskId == 'null'){
  $iquery = "SELECT * FROM potluck_tasks LIMIT 1";
  $iresults = mysql_query($iquery);
  if(mysql_num_rows($iresults) != 0){
    while($irow = mysql_fetch_array($iresults, MYSQL_ASSOC)) {
      $taskId = $irow['id'];
      break;
    }
  }else{
    return null;
  }
}

//$query = "SELECT * FROM potluck_users_$taskId where email='$email'";

$query = "SELECT * FROM potluck_users_$taskId";
$results = mysql_query($query);

if(mysql_num_rows($results) == 0){
  return null;
}else{  
  while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
    // assume just one element...
    $from = "Mobi Potluck <hq@eecs.harvard.edu>";
    $to = $email;
    $subject = "Potluck planning";
    $userId = $row['userId'];
    $name = explode(" ", $row['name']);
    $name = $name[0];
    
    $body = "Hi $name,\n\nWe are glad you will be joining us for the potluck! We'd like you to participate in planning the potluck menu with other attendees by visiting the following personalized link:\n\n $server?tid=$taskId&uid=$userId\n\n We encourage you to bookmark this link, and to check back at any time to see the latest menu and to make edits.\n\nCheers,\nDavid, Edith, and Haoqi";
    
      $host = "smtp.eecs.harvard.edu";
      $username = "hq";
      
      
      $headers = array ('From' => $from,
			'To' => $to,
			'Subject' => $subject);
      $smtp = Mail::factory('smtp',
			    array ('host' => $host,
				   // 'port' => $port,
				   // 'auth' => true,
				   'username' => $username,
				   'password' => $password));
      
      $mail = $smtp->send($to, $headers, $body);
      
    if (PEAR::isError($mail)) {
      echo("<p>" . $mail->getMessage() . "</p>");
    } else {
      echo("<p>Message successfully sent!</p>");
    }
  }
}
mysql_close();
?>