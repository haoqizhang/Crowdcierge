<?php
header('Access-Control-Allow-Origin: *');
$path = get_include_path() . PATH_SEPARATOR . '/usr/share/php';
set_include_path($path);

	define("MOBI_MYSQL_SERVER", "raven.eecs.harvard.edu");
	define("MOBI_MYSQL_USERNAME", "mobi");
	define("MOBI_MYSQL_PASSWORD", "su4Biha");
	define("MOBI_MYSQL_DATABASE", "mobi");

?>

