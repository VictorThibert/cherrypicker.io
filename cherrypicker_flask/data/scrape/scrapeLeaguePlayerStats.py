import csv
import json
import requests
import mysql.connector
from mysql.connector import errorcode

year1 = "2014"
year2 = "15"
playerID = "0"
MeasureType = "Advanced"

shots_url = "http://stats.nba.com/stats/leaguedashplayerstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00" \
            "&Location=&MeasureType=" + MeasureType + "&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=Totals&Period=0&PlayerExperience" \
            "=&PlayerPosition=&PlusMinus=N&Rank=N&Season="+ year1 + "-" + year2 + \
            "&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0" \
            "&VsConference=&VsDivision="

response = requests.get(shots_url)
response.raise_for_status()
shots = response.json()

try:
    cnx = mysql.connector.connect(user='all', password='all', host='localhost', database='2014-2015')
    cursor = cnx.cursor()
    for item in shots["resultSets"][0]["rowSet"]:

        print(item)

        add_shots = ("INSERT INTO `2014-2015leagueplayerstats` (PLAYER_ID, PLAYER_NAME, TEAM_ID, TEAM_ABBREVIATION, AGE, "
                     "GP, W, L, W_PCT, MIN, OFF_RATING, DEF_RATING, NET_RATING, AST_PCT, AST_TO, AST_RATIO, OREB_PCT, DREB_PCT, REB_PCT, TM_TOV_PCT, "
                     "EFG_PCT, TS_PCT, USG_PCT, PACE, PIE) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, "
                     "%s, %s, %s)"
                     "ON DUPLICATE KEY UPDATE PLAYER_ID=%s, PLAYER_NAME=%s, TEAM_ID=%s, TEAM_ABBREVIATION=%s, AGE=%s,  "
                     "GP=%s, W=%s, L=%s, W_PCT=%s, MIN=%s, OFF_RATING=%s, DEF_RATING=%s, NET_RATING=%s, AST_PCT=%s, AST_TO=%s, AST_RATIO=%s, OREB_PCT=%s, "
                     "DREB_PCT=%s, REB_PCT=%s, TM_TOV_PCT=%s, EFG_PCT=%s, TS_PCT=%s, USG_PCT=%s, PACE=%s, PIE=%s")

        data = (item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10], item[11],  item[12], item[13], item[14],
                item[15],  item[16], item[17], item[18], item[19], item[20], item[21], item[22], item[23], item[24], item[0], item[1], item[2], item[3],
                item[4], item[5], item[6], item[7], item[8], item[9], item[10], item[11],  item[12], item[13], item[14], item[15],  item[16], item[17],
                item[18], item[19], item[20], item[21], item[22], item[23], item[24])


        cursor.execute(add_shots, data)

        cnx.commit()
    cursor.close()
    cnx.close()


except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Access denied error")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database non-existent")
    else:
        print(err)
else:
    cnx.close()