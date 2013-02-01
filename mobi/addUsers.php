<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";




$taskId = "1eb150a5c7a43a96f76c4f94fc940311";

mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$f = fopen("potluck.csv", "r");
while (!feof($f)) {
  $line = rtrim(fgets($f));
  $in = explode(',', $line); // time, name, guests, email
  $name = rtrim($in[0]);
  $guests = rtrim($in[1]);
  $email = rtrim($in[2]);
  $userId = md5($name . $email);

  $query = "INSERT INTO potluck_users_$taskId (userId, name, email, information) VALUES ('$userId', '$name', '$email', '$guests')";

     mysql_query($query);
     //  echo $query;
    //   echo  mysql_error();
}

fclose($f);
mysql_close();
