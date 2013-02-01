<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";


require_once "Mail.php";

$from = "<mamacheese@gmail.com>";
$to = "<hq@eecs.harvard.edu>";
$subject = "Hi from gmail!";
$body = "Hi,\n\nHow are you?";
$host = "ssl://smtp.gmail.com";
$port = "465";
$username = "mamacheese";
$password = "su4Biha!";

$headers = array ('From' => $from,
		  'To' => $to,
		  'Subject' => $subject);
$smtp = Mail::factory('smtp',
		      array ('host' => $host,
			     'port' => $port,
			     'auth' => true,
			     'username' => $username,
			     'password' => $password));

$mail = $smtp->send($to, $headers, $body);

if (PEAR::isError($mail)) {
  echo("<p>" . $mail->getMessage() . "</p>");
} else {
  echo("<p>Message successfully sent!</p>");
}

    ?> 
