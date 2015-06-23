<?php header('Access-Control-Allow-Origin: *');

	ini_set('memory_limit', '256M');

	$servername = "localhost";
	$username = "all";
	$password = "all";
	$database = "2014-2015";


	$cnx = mysqli_connect($servername, $username, $password, $database);

	if (!$cnx) {
	    die("Connection failed: " . mysqli_connect_error());
	}

	$query = "SELECT `LOC_X`, `LOC_Y`, `PERCENTAGE` FROM `2014-2015locationpercentages` ";

	if ( ! $query ) {
		echo mysql_error();
		die;
	}

	$result = mysqli_query($cnx, $query);
	$data = array();

	for ($x = 0; $x < mysqli_num_rows($result); $x++) {
		$data[] = mysqli_fetch_assoc($result);
	}

	echo json_encode($data);

	mysqli_close($cnx);

?>