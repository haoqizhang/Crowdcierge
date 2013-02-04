<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";


error_reporting(0);

include('Mail.php');
include('Mail/mime.php');

// for this, we create both a turk and a friend object, but there is only one planning mission


$database = "mobi";
mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");


$query = "SELECT * FROM tour_subjects";
$results = mysql_query($query);


while($row = mysql_fetch_array($results)) {
  $id = $row['id'];
  $name = $row['name'];
  $tid = $row['tid'];
  $email = $row['email'];

  echo $tid . ';' . $id;
  
  if($tid != NULL && ($tid == '453ad2e6eeda9e3ccd9d2739c0f1025d' || $tid == '07b00cdb35f7d7b6f78b143435be4233')){
    // send email to subject with details for how to proceed
    $from = "Mobi <hq@eecs.harvard.edu>";
    $to = $email;
    $subject = "Mobi: a daily update";
    $userId = $id;
    $firstname = explode(" ", $name);
    $firstname = $firstname[0];
    
    $server = "http://people.csail.mit.edu/hqz/mobi";
    $body = "Hi $firstname,\n\n Good day! Here is an daily update on how your Mobi plans are coming along. You can check them out here:\n\n
Your friends planning for you: $server/mobi-admin-friends.html?tid=$tid&uid=$userId\n
Our people planning for you: $server/mobi-admin-crowd.html?tid=$tid&uid=$userId\n\nBe sure to recruit more of your friends to help! Here is the link to send to your friends:\n\n $server/mobi-friends.html?tid=$tid\n\n
Should you have any questions, doesn't hesitate to contact me via
email at hq@eecs.harvard.edu.\n\n Best,\nHaoqi Zhang";
    
    $host = "smtp.eecs.harvard.edu";
    $username = "hq";
    
    
    $headers = array ('From' => $from,
		      'To' => $to, 
		      'Subject' => $subject);
    $smtp = Mail::factory('smtp',
			  array ('host' => $host,
				 'username' => $username,
				 'password' => $password));
    
    
    $mailmessage = new Mail_mime();
    $html = file_get_contents("dailyemail.html");
    $yoururl = "$server/mobi-admin-friends.html?uid=$userId&tid=$tid";
    $oururl = "$server/mobi-admin-crowd.html?uid=$userId&tid=$tid";
    $friendsurl = "$server/mobi-friends.html?tid=$tid";
    $html = str_replace("___YOURURL___", $yoururl, $html);
    $html = str_replace("___OURURL___", $oururl, $html);
    $html = str_replace("___FRIENDURL___", $friendsurl, $html);
    $html = str_replace("___NAME___", $firstname, $html);
    $mailmessage->setTXTBody($body);
    $mailmessage->setHTMLBody($html);
    $body = $mailmessage->get();
    $extraheaders = array("From"=>$from,
			  'To' => $to, 
			  'Subject' => $subject);
    $headers = $mailmessage->headers($extraheaders);
    
        $mail = $smtp->send($to . ", mamacheese@gmail.com", $headers, $body);
	//    $mail = $smtp->send("mamacheese@gmail.com", $headers, $body);
    
    if (PEAR::isError($mail)) {
      //      echo("<p>" . $mail->getMessage() . "</p>");
    } else {
      //echo("<p>Message successfully sent!</p>");
      
    }
    //echo $url;
  }
    
}

mysql_close();

?>