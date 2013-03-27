<table border="2">
<?php
header('Access-Control-Allow-Origin: *');
include "settings.php";
mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$query = "SELECT * FROM subjects_tour_tasks";
$results = mysql_query($query);

echo "<tr>";
echo "<td>user</td>";
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
  $constraints = $row['constraints'];
  $status = $row['status'];
  $creator = $row['creator'];
  echo "<td>$creator</td>";
  echo "<td>$id</td>";
  echo "<td>$name</td>";
  echo "<td width='200px'>$description</td>";
  echo "<td width='125px'>$categories</td>";
  echo "<td>$constraints</td>";
  echo "<td>$status</td>";
  echo "<td><span onClick=\"removeTask('$id')\">delete</span></td>";
  //  echo "<td><span onClick=\"editTask('$id')\">edit</span></td>";
  echo "</tr>";
}
mysql_close();
?>
</table>
