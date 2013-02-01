<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";




mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$id = $_POST["id"];

  
  $query = "DELETE FROM tour_subjects where id='$id'";

  mysql_query($query);
  echo $query;
  echo  mysql_error();


mysql_close();

?>