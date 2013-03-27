<?php
header('Access-Control-Allow-Origin: *');
include "settings.php";

include('Mail.php');
include('Mail/mime.php');
error_reporting(0);

mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$server = "http://people.csail.mit.edu/hqz/mobi/Mobi/signup.html";

$name = mysql_real_escape_string($_POST["name"]);
$email = mysql_real_escape_string($_POST["email"]);
$sendmail = mysql_real_escape_string($_POST["sendmail"]);

$id = md5($name . rand());

$query = "INSERT INTO tour_subjects (id, name, email) VALUES ('$id', '$name', '$email')";

mysql_query($query);
echo  mysql_error();

if(strcmp("true", $sendmail) == 0){
  // email the person and let them know what's up with directions for next steps
    $from = "Haoqi Zhang <hqz@mit.edu>";
    $to = $email;
    $subject = "Mobi experiment: your signup link for getting started.";
    $userId = $id;
    $firstname = explode(" ", $name);
    $firstname = $firstname[0];

    $body = "Hi $firstname,\n\n Thanks for your interest in participating in this
study. We would be happy to have you as one of our subjects. You can
get started by visiting the following link, which will allow you to
enter details about your trip and also request for your consent in
participating in our study:\n\n $server?tid=$taskId&uid=$userId\n\n
Should you have any questions, doesn't hesitate to contact me via
email at hqz@mit.edu.\n\n Best,\nHaoqi Zhang";

    $host = "outgoing.csail.mit.edu";
    $username = "hqz";
    $password = "su4Biha!";
    //    $host = "ssl://smtp.gmail.com";
    //    $username = "mamacheese";
    //    $password = "su4Biha!";
    $port = "587";
    $headers = array ('From' => $from,
		      'To' => $to,
		      'Subject' => $subject);
    $smtp = Mail::factory('smtp',
			  array ('host' => $host,
				 'port' => $port,
				 //				 'auth' => true,
				 'username' => $username,
				 'password' => $password));
    

    $mailmessage = new Mail_mime();
    $html = file_get_contents("signupemail.html");
    $url = "$server?uid=$userId";

    $html = str_replace("___URL___", $url, $html);
    $html = str_replace("___NAME___", $firstname, $html);
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
      //      echo("<p>Message successfully sent!</p>");
    }
    echo $url;
} 
mysql_close();

?>