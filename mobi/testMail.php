<?php
header('Access-Control-Allow-Origin: *');
    $path = get_include_path() . PATH_SEPARATOR . '/usr/share/php';
    set_include_path($path);
//include('/usr/share/php/Mail.php');
//include('/usr/share/php/Mail.php');

  include('Mail.php');
  include('Mail/mime.php');
  //error_reporting(0);

$email = "hqz@csail.mit.edu";
if(strcmp("true", $sendmail) == 0){
  // email the person and let them know what's up with directions for next steps
  $from = "Haoqi Zhang <hqz@csail.mit.edu>";
  $to = $email;
  $subject = "Mobi experiment: your signup link for getting started.";
  $body = "Hi";
  $host = "outgoing.csail.mit.edu";
  $username = "hqz";
  $password = "su4Biha!";
  $port = "587";
  $headers = array ('From' => $from,
		    'To' => $to,
		    'Subject' => $subject);
  $smtp = Mail::factory('smtp',
			array ('host' => $host,
			       'port' => $port,
			       'auth' => true,
			       'username' => $username,
			       'password' => $password));
    

  $mailmessage = new Mail_mime();
  $html = file_get_contents("signupemail.html");
  $mailmessage->setTXTBody($body);
  $mailmessage->setHTMLBody($html);
  $body = $mailmessage->get();
  $extraheaders = array("From"=>$from,
			'To' => $to,
			'Subject' => $subject);
  $headers = $mailmessage->headers($extraheaders);
  
  $mail = $smtp->send($to, $headers, $body);
  
  if (PEAR::isError($mail)) {
    echo("<p>" . $mail->getMessage() . "</p>");
  } else {
    echo("<p>Message successfully sent!</p>");
  }
} 
?>