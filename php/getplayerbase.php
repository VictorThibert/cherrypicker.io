<?php header('Access-Control-Allow-Origin: *');

	$servername = "localhost";
	$username = "all";
	$password = "all";
	$database = "2014-2015";
	$teamString = (string)$_GET['teamID'];
	$teamIDs = array_map('intval', explode('$', $teamString));
	$playerString = (string)$_GET['playerID'];
	$playerIDs = array_map('intval', explode('$', $playerString));

	$cnx = mysqli_connect($servername, $username, $password, $database);

	if (!$cnx) {
	    die("Connection failed: " . mysqli_connect_error());
	}

	if ( ! $playerString) {
		$query = "SELECT `PLAYER_ID`,`PLAYER_NAME`,`TEAM_ID`,`TEAM_ABBREVIATION`,`AGE`,`GP`,`W`,`L`,`W_PCT`,`MIN`,`FGM`,`FGA`,`FG_PCT`,`FG3M`,`FG3A`,`FG3_PCT`,`FTM`,`FTA`,`FT_PCT`,`OREB`,`DREB`,`REB`,`AST`,`TOV`,`STL`,`BLK`,`BLKA`,`PF`,`PFD`,`PTS`,`PLUS_MINUS`,`DD2`,`TD3` FROM `2014-2015leagueplayerbase` WHERE `TEAM_ID` IN (" . implode(',', $teamIDs) .") ";
	} else { if ( ! $teamString ) {
		$query = "SELECT `PLAYER_ID`,`PLAYER_NAME`,`TEAM_ID`,`TEAM_ABBREVIATION`,`AGE`,`GP`,`W`,`L`,`W_PCT`,`MIN`,`FGM`,`FGA`,`FG_PCT`,`FG3M`,`FG3A`,`FG3_PCT`,`FTM`,`FTA`,`FT_PCT`,`OREB`,`DREB`,`REB`,`AST`,`TOV`,`STL`,`BLK`,`BLKA`,`PF`,`PFD`,`PTS`,`PLUS_MINUS`,`DD2`,`TD3` FROM `2014-2015leagueplayerbase` WHERE `PLAYER_ID` IN (" . implode(',', $playerIDs) .") ";
		} else {
			$query = "SELECT `PLAYER_ID`,`PLAYER_NAME`,`TEAM_ID`,`TEAM_ABBREVIATION`,`AGE`,`GP`,`W`,`L`,`W_PCT`,`MIN`,`FGM`,`FGA`,`FG_PCT`,`FG3M`,`FG3A`,`FG3_PCT`,`FTM`,`FTA`,`FT_PCT`,`OREB`,`DREB`,`REB`,`AST`,`TOV`,`STL`,`BLK`,`BLKA`,`PF`,`PFD`,`PTS`,`PLUS_MINUS`,`DD2`,`TD3` FROM `2014-2015leagueplayerbase` WHERE `PLAYER_ID` IN (" . implode(',', $playerIDs) .") AND `TEAM_ID` IN (" . implode(',', $teamIDs) .") ";
		}

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