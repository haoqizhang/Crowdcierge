<table border="2">
<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";

mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$query = "SELECT * FROM tour_subjects";
$results = mysql_query($query);

echo "<tr>";
  echo "<td>id</td>";
echo "<td>tid</td>"; 
  echo "<td>name</td>";
  echo "<td>email</td>";
echo "<td>delete task</td>";
echo "<td>sign up time</td>";
  echo "</tr>";

while($row = mysql_fetch_array($results)) {
  echo "<tr>";
  $id = $row['id'];
  $signuptime = $row['createTime'];
  $name = $row['name'];
  $tid = $row['tid'];
  $email = $row['email'];
  echo "<td>$id</td>";
  echo "<td>$tid</td>";
  echo "<td>$name</td>";
  echo "<td>$email</td>";
  echo "<td><span onClick=\"removeUser('$id')\">delete</span></td>";
  echo "<td>$signuptime</td>";
  echo "</tr>";
}
mysql_close();
?>
</table>
