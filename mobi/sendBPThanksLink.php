<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";


error_reporting(0);

include('Mail.php');
//include('Mail/mime.php');

// check the guy has an account with us
mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");
$server = "http://people.csail.mit.edu/hqz/mobi/outing.html";


$taskIds = array('e21342b2ae06463a400a62b094872a73', '49b01c13f1658c1a05c56f4ccc70fc62');
$teams = array('boston', 'prefrosh');
$titles = array('ultimate Boston outing', 'ultimate prefrosh weekend');
$email = 'hq@eecs.harvard.edu';

$count = count($taskIds);

$i = 1;
$query = "SELECT * FROM tour_users_$taskIds[$i]";
$results = mysql_query($query);


while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
  // assume just one element...
  $from = "Haoqi Zhang <hq@eecs.harvard.edu>";
  $to = $row['email'];
  // $to = $email;
  $subject = "Thank you for playing with Mobi";
  $userId = $row['userId'];
  $name = explode(" ", $row['name']);
  $name = $name[0];
  
  
  $body = "Dear $name,\n\n Thank you for contributing to the Mobi $titles[$i]! You can see a picture of the final plan you and other students came up with:\n\n http://dl.dropbox.com/u/1441157/$teams[$i].png \n\n As we continue our research on Mobi, we aim to better understand people's experience in using the system and how best to improve it. We know that you are busy, but it would be super awesome if you can take 3 minutes to answer the questions below by simply replying to this email:\n\n 1. Briefly describe your experience using Mobi.\n\n 2. What did you like about Mobi? What didn't you like?\n\n 3. What do you think about the final itinerary shown in the linked photo?\n\n\n Thanks again, and we hope you had fun!\n\n Best,\n Haoqi and Edith\n\n ps: we will write to the 2 randomly drawn participants in a separate email soon. To protect anonymity we won't announce the winners publicly (sorry!)";
  $host = "smtp.eecs.harvard.edu";
  $username = "hq";
  $password = "su4Biha";
  
  $headers = array ('From' => $from,
		    'To' => $to,
		    'Subject' => $subject);
  $smtp = Mail::factory('smtp',
			array ('host' => $host,
			       //				 'port' => $port,
			       // 'auth' => true,
			       'username' => $username,
			       'password' => $password));
  
  
  //    $url = "$server?tid=$taskIds[i]&uid=$userId";
  
    $mail = $smtp->send($to, $headers, $body);
    
    if (PEAR::isError($mail)) {
      echo("<p>" . $mail->getMessage() . "</p>");
    } else {
      echo("<p>Message successfully sent!</p>");
      
    }
}

mysql_close();
?>