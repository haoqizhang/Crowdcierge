<?php
header('Access-Control-Allow-Origin: *');
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
$server = "http://people.csail.mit.edu/hqz/mobi/tour.html";


$taskId = '49b01c13f1658c1a05c56f4ccc70fc62';
$email = 'hq@eecs.harvard.edu';
$query = "SELECT * FROM tour_users_$taskId";
$results = mysql_query($query);

while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
    // assume just one element...
    $from = "Mobi Prefrosh Weekend <hq@eecs.harvard.edu>";
    $to = $row['email'];
    //$to = $email;
    $subject = "Prefrosh weekend planning ends Sunday, 5PM";
    $userId = $row['userId'];
    $name = explode(" ", $row['name']);
    $name = $name[0];

    $body = "Hi $name,\n\nHappy Friday! Just a reminder that the planning for the ultimate prefrosh weekend ends this Sunday at 5pm. Please feel free to make additional edits before then!";
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
    $html = file_get_contents("prefroshreminder.html");
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