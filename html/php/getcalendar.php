<?php header('Access-Control-Allow-Origin: *');

	$servername = "localhost";
	$username = "all";
	$password = "all";
	$database = "2014-2015";
	$teamString = (string)$_GET['teamID'];
	$teamIDs = array_map('strval', explode('$', $teamString));
	

	$cnx = mysqli_connect($servername, $username, $password, $database);

	if (!$cnx) {
	    die("Connection failed: " . mysqli_connect_error());
	}

	$query = "SELECT `GAME_ID`, `GAME_DATE_EST`, `HOME_TEAM_ID`, `VISITOR_TEAM_ID`, `HOME_POINTS`, `AWAY_POINTS`, `MATCHUP` FROM `2014-2015games` WHERE `HOME_TEAM_ID` IN (" . implode(',', $teamIDs) .") ";
	



	if($teamString == "ALLTEAMS"){
		$query = "SELECT `GAME_ID`, `GAME_DATE_EST`, `HOME_TEAM_ID`, `VISITOR_TEAM_ID`, `HOME_POINTS`, `AWAY_POINTS`, `MATCHUP` FROM `2014-2015games`";
	}

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