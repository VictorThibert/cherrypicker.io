<?php

error_reporting(E_ALL ^ E_DEPRECATED);
 $username = "nbastats";
 $password = "abc123";
 $host = "85.10.205.173";
 $database="nbastats";

 $server = mysql_connect($host, $username, $password);
 $connection = mysql_select_db($database, $server);

 $myquery = "
SELECT `year`, `w`, `l` FROM `wl`
";
 $query = mysql_query($myquery);

 if ( ! $query ) {
  echo mysql_error();
  die;
 }

 $data = array();

 for ($x = 0; $x < mysql_num_rows($query); $x++) {
  $data[] = mysql_fetch_assoc($query);
 }

 echo json_encode($data);

 mysql_close($server);
?>