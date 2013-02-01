<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";

mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$id = mysql_real_escape_string($_POST["id"]);
$type = mysql_real_escape_string($_POST["type"]);
$name = mysql_real_escape_string($_POST["activity"]);
$description = mysql_real_escape_string($_POST["description"]);
$categories = mysql_real_escape_string($_POST["categories"]);
$constraints_verbal = mysql_real_escape_string($_POST["verbal"]);


if(strcmp("potluck", $type) == 0){
  // update task entry in task list
  $query = "UPDATE potluck_tasks SET name='$name', description='$description', categories='$categories', constraints_verbal='$constraints_verbal', createTime=now() WHERE id='$id'";

  mysql_query($query);
  //    echo $query;
  echo  mysql_error();

}

mysql_close();

?>