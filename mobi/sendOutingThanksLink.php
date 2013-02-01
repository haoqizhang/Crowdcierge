<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";


error_reporting(0);

include('Mail.php');
//include('Mail/mime.php');

// check the guy has an account with us


$database = "mobi";
mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");
$server = "http://people.csail.mit.edu/hqz/mobi/outing.html";


$taskIds = array('e90e28e85a7628c9feed376d0c6df30e', 'f5843d79f4c98659744eab73fb64e090', 'cbd515a95b9a324e4156f5ea2324b8ad', '2de3f4befd296555cef969f5fea6563c', '4b3908142c8ab86ad9988bb52c711fed', '0c3766a5c7affbb9fecaf075cfee9100', 'b7f77237831dc0c1dea1158852425b89');

$email = 'hq@eecs.harvard.edu';

$count = count($taskIds);

for ($i = 0; $i < $count; $i++) {
  $query = "SELECT * FROM tour_users_$taskIds[$i]";
  $results = mysql_query($query);
  $teams = array('EconCS', 'Theory', 'Architecture', 'PL', 'AIRG', 'VCG', 'SYRAH');
  

  while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
    // assume just one element...
    $from = "Haoqi Zhang <hq@eecs.harvard.edu>";
    $to = $row['email'];
    //$to = $email;
    $subject = "Thank you for playing with Mobi";
    $userId = $row['userId'];
    $name = explode(" ", $row['name']);
    $name = $name[0];
    
    $body = "Dear $name,\n\n Thank you for using Mobi for planning your group's outing! You can see a picture of the final plan your team came up with:\n\n http://dl.dropbox.com/u/1441157/GroupOuting/$teams[$i].png \n\n As we continue our research on Mobi, we aim to better understand people's experience in using the system and how best to improve it. We know that you are busy, but it would be super awesome if you can take 5 minutes to answer the questions below by simply replying to this email:\n\n 1. Briefly describe your experience using Mobi.\n\n 2. What did you like about Mobi? What didn't you like?\n\n 3. What do you think about the final itinerary shown in the linked photo?\n\n 4. In your personal experience, how are group outings typically planned (research group or otherwise)?\n\n 5. How is planning a group outing using Mobi better or worse than the typical way group outings are planned as you described in (4)?\nBetter:\n\nWorse:\n\n\n Thanks again, and we hope you had fun!\n\n Best,\n Haoqi and Edith\n\n ps: we will put all the groups' plans up for a public vote soon. If you wish to opt-out of the voting, just let me know.";
    $host = "smtp.eecs.harvard.edu";
    $username = "hq";
    
    
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
}
 mysql_close();
?>