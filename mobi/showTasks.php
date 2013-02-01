<table border="2">

<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";


mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$query = "SELECT * FROM potluck_tasks";
$results = mysql_query($query);

echo "<tr>";
  echo "<td>id</td>";
  echo "<td>name</td>";
  echo "<td>description</td>";
  echo "<td>categories</td>";
  echo "<td>preferences</td>";
  echo "<td>status</td>";
  echo "</tr>";

while($row = mysql_fetch_array($results)) {
  echo "<tr>";
  $id = $row['id'];
  $name = $row['name'];
  $description = $row['description'];
  $categories = implode('<br/>', json_decode($row['categories']));
  $verbal = implode('<br/>', json_decode($row['constraints_verbal']));
  $status = $row['status'];

  echo "<td>$id</td>";
  echo "<td>$name</td>";
  echo "<td>$description</td>";
  echo "<td>$categories</td>";
  echo "<td>$verbal</td>";
  echo "<td>$status</td>";
  echo "<td><span onClick=\"removeTask('$id')\">delete</span></td>";
  echo "<td><span onClick=\"editTask('$id')\">edit</span></td>";
  echo "</tr>";
}
mysql_close();
?>
</table>
