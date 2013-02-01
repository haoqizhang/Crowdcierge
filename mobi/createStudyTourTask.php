<?php
include "settings.php";
error_reporting(0);
include('Mail.php');
include('Mail/mime.php');

// for this, we create both a turk and a friend object, but there is only one planning mission
mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$uid = mysql_real_escape_string($_POST["uid"]);
$type = mysql_real_escape_string($_POST["type"]);
$name = mysql_real_escape_string($_POST["activity"]);
$description = mysql_real_escape_string($_POST["description"]);
$categories = mysql_real_escape_string($_POST["categories"]);
$constraints = mysql_real_escape_string($_POST["constraints"]);
$start = mysql_real_escape_string($_POST["start"]);
$end = mysql_real_escape_string($_POST["end"]);
$beginTime = intval($_POST["beginTime"]);
$endTime = intval($_POST["endTime"]);
$zoom = intval($_POST["zoom"]);
$transitAvailable = intval($_POST["transit"]);
$creator = mysql_real_escape_string($_POST["creator"]);
$id = md5($name . rand());
$email = mysql_real_escape_string($_POST["email"]);


if(strcmp("both", $type) == 0){

  // create task entry in task list
  $query = "INSERT INTO subjects_tour_tasks (id, name, description, categories, constraints, start, end, beginTime, endTime, createTime, status, creator, transit, zoom) VALUES ('$id', '$name', '$description', '$categories', '$constraints', '$start', '$end', $beginTime, $endTime, now(), 'open', '$creator', $transitAvailable, $zoom)";
  mysql_query($query);
  echo  mysql_error();

  // create a generic table for work done for the task [BY FRIENDS]
  $tquery = "CREATE TABLE tour_$id (hitId mediumint PRIMARY KEY NOT NULL AUTO_INCREMENT, userId char(32), assignmentId char(32), answer text, submitTime datetime, changeInfo text, UNIQUE(hitId))";
  mysql_query($tquery);
  echo  mysql_error();

  // create a table for people who we want to pre-register for the 
  // task --- register others automatically as we go... [BY FRIENDS]
  $rquery = "CREATE TABLE tour_users_$id (userId char(32), name varchar(128), email varchar(128), information text)";
  mysql_query($rquery);
  echo  mysql_error();

 // create a table for the program's state [BY FRIENDS]
  $squery = "CREATE TABLE tour_state_$id (stateId mediumint PRIMARY KEY NOT NULL AUTO_INCREMENT, state mediumtext, userId char(32), assignmentId char(32), submitTime datetime, changeInfo text, UNIQUE(stateId))";
   mysql_query($squery);
  echo  mysql_error();

  // create a generic table for work done for the task [BY TURKERS]
  $ttquery = "CREATE TABLE turktour_$id (hitId mediumint PRIMARY KEY NOT NULL AUTO_INCREMENT, userId char(32), assignmentId char(32), answer text, submitTime datetime, changeInfo text, UNIQUE(hitId))";
  mysql_query($ttquery);
  echo  mysql_error();

  // create a table for people who we want to pre-register for the 
  // task --- register others automatically as we go... [BY TURKERS]
  $trquery = "CREATE TABLE turktour_users_$id (userId char(32), name varchar(128), email varchar(128), information text)";
  mysql_query($trquery);
  echo  mysql_error();

 // create a table for the program's state [BY TURKERS]
  $tsquery = "CREATE TABLE turktour_state_$id (stateId mediumint PRIMARY KEY NOT NULL AUTO_INCREMENT, state mediumtext, userId char(32), assignmentId char(32), submitTime datetime, changeInfo text, UNIQUE(stateId))";
   mysql_query($tsquery);


  // insert the host's info and create initial state
  $state = array();
  $state['itinerary'] = array();
  $state['stream'] = array();
  $state['admin']['id'] = $id;
  $state['admin']['type'] = $_POST["type"];
  $state['admin']['name'] = $_POST["activity"];
  $state['admin']['description'] = $_POST["description"];
  $state['admin']['categories'] = json_decode($_POST["categories"]);
  $state['admin']['constraints'] = json_decode($_POST["constraints"]);
  $state['admin']['start'] = json_decode($_POST["start"]);
  $state['admin']['end'] = json_decode($_POST["end"]);
  $state['admin']['beginTime'] = $beginTime;
  $state['admin']['endTime'] = $endTime;
  $state['admin']['status'] = 'open';
  $state['admin']['transit'] = $transitAvailable;
  $state['admin']['zoom'] = $zoom;
  $state['admin']['creator'] = $creator; //$uid;//_POST["creator"];
  $stateAct =  mysql_real_escape_string(json_encode($state));
  echo $stateAct;

  // do it for friends
  $wquery = "INSERT INTO tour_state_$id (state, submitTime) VALUES ('$stateAct', now())";
  mysql_query($wquery);
  echo  mysql_error();

  // do it for turk
  $twquery = "INSERT INTO turktour_state_$id (state, submitTime) VALUES ('$stateAct', now())";
  mysql_query($twquery);
  echo  mysql_error();

  // assign the id to the task subject 
  $idquery = "UPDATE tour_subjects SET tid='$id' WHERE id='$uid'";
  mysql_query($idquery);
  echo mysql_error();

  // assign the time to the task subject
  $timequery = "UPDATE tour_subjects SET createTime=now() WHERE id='$uid'";
  mysql_query($timequery);
  echo mysql_error();

  // create a user account for host
  $bossquery = "INSERT INTO tour_users_$id (userId, name, email) VALUES ('$uid', '$creator', '$email')";
  mysql_query($bossquery);



  // create a user account for host
  $tbossquery = "INSERT INTO turktour_users_$id (userId, name, email) VALUES ('$uid', '$creator', '$email')";
  mysql_query($tbossquery);



  // send email to subject with details for how to proceed
      $from = "Haoqi Zhang <hqz@mit.edu>";
    $to = $email;
    $subject = "Welcome to Mobi: important links and next steps";
    $userId = $uid;
    $firstname = explode(" ", $creator);
    $firstname = $firstname[0];

    $server = "http://people.csail.mit.edu/hqz/mobi";
    $body = "Hi $firstname,\n\n Congratulations on signing up for Mobi! Now that you 
are in, we can share with your personal Mobi pages and the link to send to your friends 
to recruit them to help! We recommend that you bookmark the personalized links in this email for 
easy access.\n\n Administrator pages (your command center for watching and participating in the planning process):\n
Your friends planning for you: $server/mobi-friends.html?tid=$id&uid=$uid\n
Our people planning for you: $server/mobi-crowd.html?tid=$id&uid=$uid\n\nHere is the link to send to your friends to recruit them to help:\n\n $server/tour.html?tid=$id\n\n
Should you have any questions, doesn't hesitate to contact me via
email at hq@eecs.harvard.edu.\n\n Best,\nHaoqi Zhang";

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
				 'username' => $username,
				 'password' => $password));
    

    $mailmessage = new Mail_mime();
    $html = file_get_contents("welcomeemail.html");
    $yoururl = "$server/mobi-admin-friends.html?uid=$userId&tid=$id";
    $oururl = "$server/mobi-admin-crowd.html?uid=$userId&tid=$id";
    $friendsurl = "$server/mobi-friends.html?tid=$id";
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

    $mail = $smtp->send($to . ",mamacheese@gmail.com", $headers, $body);
    
    
    if (PEAR::isError($mail)) {
      //      echo("<p>" . $mail->getMessage() . "</p>");
          } else {
      //echo("<p>Message successfully sent!</p>");
    
    }
    echo $url;


}

mysql_close();

?>