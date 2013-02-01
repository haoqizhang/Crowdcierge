<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";


include('Mail.php');
include('Mail/mime.php');
//require_once "Mail.php";


$from = "Mobi Potluck <hq@eecs.harvard.edu>";
$to = $_POST['to'];

$sendername = $_POST['from'];
$senderemail = $_POST['fromemail'];
$subject = "Potluck request from " . $sendername;
$msg = $_POST['msg'];
$item = $_POST['item'];
$body = $_POST['msg'];
$taskId = $_POST['taskId'];
$userId = $_POST['userId'];
$toId = $_POST['toId'];
$stateId = $_POST['stateId'];


/* $host = "ssl://smtp.gmail.com"; */
/* $port = "465"; */
/* $username = "mamacheese@gmail.com"; */
/* $password = "su4Biha!"; */

$host = "smtp.eecs.harvard.edu";
$username = "hq";
$password = "su4Biha";

//$headers = array ('From' => $from,'To' => $to,  'Subject' => $subject);
$smtp = Mail::factory('smtp',
		      array ('host' => $host,
			     // 'port' => $port,
			     // 'auth' => true,
			     'username' => $username,
			     'password' => $password));

$mailmessage = new Mail_mime();
$html = file_get_contents("email.html");
$html = str_replace("___MESSAGE___", str_replace("\n", ' <br/>', $msg), $html);
$html = str_replace("___FROMEMAIL___", $senderemail, $html);
$html = str_replace("___FROMNAME___", $sendername, $html);
$urlparam = "tid=$taskId&uid=$toId";
$html = str_replace("___URLPARAM___", $urlparam, $html);

$mailmessage->setTXTBody($msg);
$mailmessage->setHTMLBody($html);
$body = $mailmessage->get();
$extraheaders = array("From"=>$from,
		      'To' => $to,
		      'Subject' => $subject);
$headers = $mailmessage->headers($extraheaders);

$mail = $smtp->send($to, $headers, $body);

if (PEAR::isError($mail)) {
  //  echo("<p>" . $mail->getMessage() . "</p>");
} else {
  // LOG IT
  
  
  
  
  mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
  @mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");
  
 
  $userId = mysql_real_escape_string($userId);
  $taskId = mysql_real_escape_string($taskId);
  $toId = mysql_real_escape_string($toId);
  $item = mysql_real_escape_string($item);
  $msg  =  mysql_real_escape_string($msg);

  $query = "INSERT INTO potluck_request_$taskId (stateId, userId, toId, item, message, submitTime) VALUES ($stateId, '$userId', '$toId', '$item', '$msg', now())";

  //  echo $query;
  mysql_query($query);
  echo  mysql_error();

  mysql_close();
  
  echo("<p>Message successfully sent!</p>");
}
?>
