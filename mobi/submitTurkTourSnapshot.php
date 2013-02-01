<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";


error_reporting(0);

include('Mail.php');
include('Mail/mime.php');

// check the guy has an account with us



$database = "mobi";
mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$userId = $_POST["userId"];
$answer = $_POST["answer"];
$taskId = $_POST["taskId"];
$type =  $_POST["type"];
$startState = $_POST["startState"];
$requestername = $_POST["requestername"];
$requesteremail = $_POST["requesteremail"];
$itinerary = $_POST["itinerary"];


if(strcmp("turktour", $type) == 0){
  $userId = mysql_real_escape_string($userId);
  $taskId = mysql_real_escape_string($taskId);

  /// check if turktour has changed since state is loaded
  $squery = "SELECT * from turktour_state_$taskId ORDER BY stateId DESC LIMIT 1";
  $results = mysql_query($squery);
  if(mysql_num_rows($results) != 0){
    while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
      $lastid = $row['stateId'];
      $lastuid = $row['userId'];
      if($startState != $lastid && $userId != $lastuid){
	// state has changed since you came, and you weren't the last one to 
	// touch it
	return null;
      }
    }
  }


  // check that there are no inconsistencies
  // decode answer
  $aj = json_decode($answer, true);
  $aj = $aj['itinerary'];
  $func = function($value){
    return substr($value, 5);
  };
  $item_ids = array_map($func, $aj);
  $string = implode(',', $item_ids);
  
  $checkquery = "SELECT * FROM turktour_$taskId where hitId in ($string) and changeInfo IS NOT NULL";

  $checkresult = mysql_query($checkquery); 
  if(mysql_num_rows($checkresult) != 0){ 
    return; 
  } 

  // no inconsistencies, can continue
  $answer = mysql_real_escape_string($answer);
  $query = "INSERT INTO turktour_state_$taskId (state, userId, submitTime, changeInfo) VALUES ('$answer', '$userId', now(), 'snapshot')";
   
  if(!mysql_query($query)){
    echo  mysql_error();
  }else{
    echo mysql_insert_id();
  }

  // send email with it
    $from = "Mobi<hq@eecs.harvard.edu>";
    $to = $requesteremail;
    $subject = "A snapshot of your Mobi itinerary (with help from our people)";
    $name = explode(" ", $requestername);
    $name = $name[0];

    $body = "Hi $name,\n\n We have saved a snapshot of your itinerary (with help from our people) for you!\n\n Best,\n Mobi admin";

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
    


    $mailmessage = new Mail_mime();
    $html = file_get_contents("subjectcrowdsnapshotemail.html");



      $html = str_replace("___ITINERARY___", $itinerary, $html);    $html = str_replace("___REQUESTER___", $name, $html);
    
    $mailmessage->setTXTBody($body);
    $mailmessage->setHTMLBody($html);
    $body = $mailmessage->get();
    $extraheaders = array("From"=>$from,
			  'To' => $to,
			  'Subject' => $subject);
    $headers = $mailmessage->headers($extraheaders);

    $mail = $smtp->send($to, $headers, $body);
    
    if (PEAR::isError($mail)) {
      //      echo("<p>" . $mail->getMessage() . "</p>");
          } else {
      // echo("<p>Message successfully sent!</p>");
    
    }

}

mysql_close();
?>