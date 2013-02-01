<table border="2">
<?php
include "settings.php";
   function formatChoice($c){
   return $c['item'] . ' (' . $c['type'] . ')';
 }



mysql_connect(MOBI_MYSQL_SERVER, MOBI_MYSQL_USERNAME, MOBI_MYSQL_PASSWORD);
@mysql_select_db(MOBI_MYSQL_DATABASE) or die( "Unable to select database");

$id = $_GET['id'];
$query = "SELECT * FROM potluck_$id";
$results = mysql_query($query);

echo "<tr>";
  echo "<td>answer</td>";
  echo "</tr>";

while($row = mysql_fetch_array($results)) {
  echo "<tr>";
  $answer = $row['answer'];
  //  $selection = ($answer['selection']);
  //  $choices = array_map("formatChoice", $answer['choices']);
  //  $preferences = $answer['preferences'];

  echo "<td>$answer</td>";
  //  echo "<td>" . implode('<br/>', $choices) . "</td>";
  //  echo "<td>" . implode('<br/>', $preferences) . "</td>";

  // ADD REMOVE ENTRY (ADD LINE ID)
  echo "</tr>";
}
mysql_close();
?>
</table>
