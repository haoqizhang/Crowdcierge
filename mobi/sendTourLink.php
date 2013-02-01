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
$server = "http://people.csail.mit.edu/hqz/mobi/tour.html";


$name = $_POST['name'];
$email = $_POST['email'];
$taskId = $_POST['taskId'];
$userId = md5($name . $email);

if($taskId == 'null'){
  return null;

  /* $iquery = "SELECT * FROM tour_tasks ORDER BY createTime DESC LIMIT 1"; */
  /* $iresults = mysql_query($iquery); */
  /* if(mysql_num_rows($iresults) != 0){ */
  /*   while($irow = mysql_fetch_array($iresults, MYSQL_ASSOC)) { */
  /*     $taskId = $irow['id']; */
  /*     break; */
  /*   } */
  /* }else{ */
  /*   return null; */
  /* } */
}

$query = "SELECT * FROM tour_users_$taskId where email='$email'";
$results = mysql_query($query);

if(mysql_num_rows($results) == 0){
  // no history, create new record
  $query = "INSERT INTO tour_users_$taskId (userId, name, email) VALUES ('$userId', '$name', '$email')";
  mysql_query($query);
  $query = "SELECT * FROM tour_users_$taskId where email='$email'";
  $results = mysql_query($query);
}
 
while($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
    // assume just one element...
    $from = "Mobi Tour <hq@eecs.harvard.edu>";
    $to = $email;
    $subject = "Your Harvard tour planning link";
    $userId = $row['userId'];
    $name = explode(" ", $row['name']);
    $name = $name[0];

    $body = "Hi $name,\n\nYour personal link for planning the Harvard tour with other students is:\n\n $server?tid=$taskId&uid=$userId\n\n Best,\nmobi tour admin";
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
    $html = file_get_contents("harvardemail.html");
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
    echo $url;
    
}

 mysql_close();
?>