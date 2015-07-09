<?php header('Access-Control-Allow-Origin: *');

	$servername = "localhost";
	$username = "all";
	$password = "all";
	$database = "2014-2015";
	$teamString = (string)$_GET['teamID'];
	$teamIDs = array_map('strval', explode('$', $teamString));
	$gamecodeString = (string)$_GET['gamecode'];
	$gamecodes = array_map('intval', explode('$', $gamecodeString));

	$cnx = mysqli_connect($servername, $username, $password, $database);

	if (!$cnx) {
	    die("Connection failed: " . mysqli_connect_error());
	}

	if ( ! $gamecodeString) {
		$query = "SELECT `GAMECODE`, `GAME_ID`, `GAME_DATE_EST`, `TEAM_ID`, `TEAM_ABBREVIATION`, `WIN`, `PTS`, `FG_PCT`, `FT_PCT`, `FG3_PCT`, `AST`, `REB`, `STL`, `BLK`, 
		`TOV`, `PLUS_MINUS` FROM `2014-2015gamedata` WHERE `TEAM_ID` IN (" . implode(',', $teamIDs) .") ";
	} else { if ( ! $teamString ) {
		$query = "SELECT `GAMECODE`, `GAME_ID`, `GAME_DATE_EST`, `TEAM_ID`, `TEAM_ABBREVIATION`, `WIN`, `PTS`, `FG_PCT`, `FT_PCT`, `FG3_PCT`, `AST`, `REB`, `STL`, `BLK`, 
		`TOV`, `PLUS_MINUS` FROM `2014-2015gamedata` WHERE `GAMECODE` IN (" . implode(',', $gamecodes) .") ";
		} else {
			$query = "SELECT `GAMECODE`, `GAME_ID`, `GAME_DATE_EST`, `TEAM_ID`, `TEAM_ABBREVIATION`, `WIN`, `PTS`, `FG_PCT`, `FT_PCT`, `FG3_PCT`, `AST`, `REB`, `STL`, `BLK`, 
		`TOV`, `PLUS_MINUS` FROM `2014-2015gamedata` WHERE `GAMECODE` IN (" . implode(',', $gamecodes) .") AND `TEAM_ID` IN (" . implode(',', $teamIDs) .") ";
		}

	}

	if( $teamString == "ALLTEAMS"){
		$query = "SELECT `GAMECODE`, `GAME_ID`, `GAME_DATE_EST`, `TEAM_ID`, `TEAM_ABBREVIATION`, `WIN`, `PTS`, `FG_PCT`, `FT_PCT`, `FG3_PCT`, `AST`, `REB`, `STL`, `BLK`, 
		`TOV`, `PLUS_MINUS` FROM `2014-2015gamedata` ";
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