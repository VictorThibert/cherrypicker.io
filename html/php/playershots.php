<?php header('Access-Control-Allow-Origin: *');

	$servername = "localhost";
	$username = "all";
	$password = "all";
	$database = "atlanta";
	$playerString = (string)$_GET['playerID'];
	$playerIDs = array_map('intval', explode('$', $playerString));

	$cnx = mysqli_connect($servername, $username, $password, $database);

	if (!$cnx) {
	    die("Connection failed: " . mysqli_connect_error());
	}

	$query = "SELECT `PLAYER_ID`, `LOC_X`, `LOC_Y`, `SHOT_MADE_FLAG`, `SHOT_DISTANCE` FROM `playershots` WHERE `PLAYER_ID` IN (" . implode(',', $playerIDs) .") ";

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