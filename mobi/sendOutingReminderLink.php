<?php
header('Access-Control-Allow-Origin: *');
include "settings.php";
error_reporting(0);

include('Mail.php');
include('Mail/mime.php');

// check the guy has an account with us

mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");
$server = "http://people.csail.mit.edu/hqz/mobi/outing.html";


$taskId = '420ca911960c2a54f76fb2fe0a9f1e6e';
$email = 'hq@eecs.harvard.edu';
$query = "SELECT * FROM tour_users_$taskId";
$results = mysql_query($query);

while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
    // assume just one element...
    $from = "Mobi Group Outing <hq@eecs.harvard.edu>";
    $to = $row['email'];
    //    $to = $email;
    $subject = "Your planning link (planning ends at midnight!)";
    $userId = $row['userId'];
    $name = explode(" ", $row['name']);
    $name = $name[0];

    $body = "Hi $name,\n\nHappy Saturday! Just a reminder that the group outing planning ends at midnight tonight!";
    $host = "smtp.eecs.harvard.edu";
    $username = "hq";
    $password = "su4Biha";

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
    $html = file_get_contents("outingreminder.html");
    $url = "$server?tid=$taskId&uid=$userId";



    $html = str_replace("___URL___", $url, $html);
    $html = str_replace("___NAME___", $name, $html);
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