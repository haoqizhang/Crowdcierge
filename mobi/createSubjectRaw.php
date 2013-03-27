<?php
header('Access-Control-Allow-Origin: *');
include "settings.php";
error_reporting(0);

mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);

$name = mysql_real_escape_string($_POST["name"]);
$email = mysql_real_escape_string($_POST["email"]);

$id = md5($name . rand());

$query = "INSERT INTO tour_subjects (id, name, email) VALUES ('$id', '$name', '$email')";

mysql_query($query);
mysql_close();

echo $id;

?>