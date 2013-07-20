<?php
header('Access-Control-Allow-Origin: *');
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
include "settings.php";

 
// Data could be pulled from a DB or other source
$cities = array(
		array('city'=>'New York', 'state'=>'NY'),
		array('city'=>'Los Angeles', 'state'=>'CA'),
		array('city'=>'Yellowstone National Park', 'state'=>'MT'),
		array('city'=>'Chicago', 'state'=>'IL'),
		array('city'=>'Houston', 'state'=>'TX'),
		array('city'=>'Phoenix', 'state'=>'AZ'),
		array('city'=>'Philadelphia', 'state'=>'PA'),
		array('city'=>'San Antonio', 'state'=>'TX'),
		array('city'=>'Dallas', 'state'=>'TX'),
		array('city'=>'San Diego', 'state'=>'CA'),
		array('city'=>'San Jose', 'state'=>'CA'),
		array('city'=>'Detroit', 'state'=>'MI'),
		array('city'=>'San Francisco', 'state'=>'CA'),
		array('city'=>'Jacksonville', 'state'=>'FL'),
		array('city'=>'Indianapolis', 'state'=>'IN'),
		array('city'=>'Austin', 'state'=>'TX'),
		array('city'=>'Columbus', 'state'=>'OH'),
		array('city'=>'Fort Worth', 'state'=>'TX'),
		array('city'=>'Charlotte', 'state'=>'NC'),
		array('city'=>'Memphis', 'state'=>'TN'),
		array('city'=>'Baltimore', 'state'=>'MD'),
		array('city'=>'Honolulu', 'state'=>'HI'),
		array('city'=>'Boston', 'state'=>'MA'),
		array('city'=>'Cambridge', 'state'=>'MA'),
		array('city'=>'Washington', 'state'=>'D.C.'),
		array('city'=>'Seattle', 'state'=>'WA'),
		array('city'=>'Las Vegas', 'state'=>'NV'),
		array('city'=>'Orlando', 'state'=>'FL'),
		array('city'=>'Salt Lake City', 'state'=>'UT'),
		array('city'=>'Atlantic City', 'state'=>'NJ'),
		array('city'=>'Denver', 'state'=>'CO'),
		array('city'=>'Miami', 'state'=>'FL'),
		array('city'=>'Minneapolis-St. Paul', 'state'=>'MN'),
		array('city'=>'Atlanta', 'state'=>'GA'),
		array('city'=>'Toronto', 'state'=>'Canada'),
		array('city'=>'Pittsburgh', 'state'=>'PA'),
		array('city'=>'Montreal', 'state'=>'Canada'),
		array('city'=>'Quebec', 'state'=>'Canada'),
		array('city'=>'Nashville', 'state'=>'TN'),
		array('city'=>'New Orleans', 'state'=>'LA'),
		array('city'=>'Calgary', 'state'=>'Canada'),
		array('city'=>'Ottawa', 'state'=>'Canada'),
		array('city'=>'Vancouver', 'state'=>'Canada'),
		array('city'=>'Portland', 'state'=>'OR'),
		array('city'=>'Juneau', 'state'=>'AK'),
		);
	   
		
// Cleaning up the term
$term = trim(strip_tags($_GET['term']));
 
// Rudimentary search
$matches = array();
foreach($cities as $city){
  if(stripos($city['city'], $term) !== false){
    // Add the necessary "value" and "label" fields and append to result set
    $city['value'] = "{$city['city']}, {$city['state']}";
    $city['label'] = "{$city['city']}, {$city['state']}";
    $matches[] = $city;
  }
}
 
// Truncate, encode and return the results
$matches = array_slice($matches, 0, 5);
print json_encode($matches);
