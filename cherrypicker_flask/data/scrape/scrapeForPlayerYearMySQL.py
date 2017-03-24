#scrapes all player shots (x,y) coordinates for shotchart

import csv
import json
import requests
import mysql.connector
from mysql.connector import errorcode

year1 = "2014"
year2 = "15"
playerID = "0"


shots_url = "http://stats.nba.com/stats/shotchartdetail?CFID=&CFPARAMS=&ContextFilter=&ContextMeasure=FG_PCT&DateFrom=&DateTo=&GameID=&GameSegment=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&Period=0&PlayerID=" + playerID + "&Position=&RookieYear=&Season=" + year1 + "-" + year2 + "&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&VsDivision=&mode=Advanced&showDetails=1&showShots=0&showZones=1"
print("http://stats.nba.com/stats/shotchartdetail?CFID=&CFPARAMS=&ContextFilter=&ContextMeasure=FG_PCT&DateFrom=&DateTo=&GameID=&GameSegment=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&Period=0&PlayerID=" + playerID + "&Position=&RookieYear=&Season=" + year1 + "-" + year2 + "&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&VsDivision=&mode=Advanced&showDetails=1&showShots=0&showZones=1")
response = requests.get(shots_url)
response.raise_for_status()
shots = response.json()

print(shots)
# try:
#     cnx = mysql.connector.connect(user='all', password='all', host='localhost', database='2014-2015')
#     cursor = cnx.cursor()
#     for item in shots["resultSets"][0]["rowSet"]:
#         unique_id = item[1] + str(item[2]).zfill(4)
#         unique_id = int(float(unique_id))

#         add_shots = ("INSERT INTO `2014-2015playershots` (UNIQUE_ID, GAME_ID, GAME_EVENT_ID, PLAYER_ID, PLAYER_NAME, TEAM_ID, TEAM_NAME, SHOT_TYPE, "
#                      "SHOT_DISTANCE, LOC_X, LOC_Y, SHOT_MADE_FLAG) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) "
#                      "ON DUPLICATE KEY UPDATE GAME_ID=%s, GAME_EVENT_ID=%s, PLAYER_ID=%s, PLAYER_NAME=%s, TEAM_ID=%s, TEAM_NAME=%s, "
#                      "SHOT_TYPE=%s, SHOT_DISTANCE=%s,LOC_X=%s, LOC_Y=%s, SHOT_MADE_FLAG=%s")

#         print(unique_id)

#         data = (unique_id, item[1], item[2], item[3], item[4], item[5], item[6], item[12], item[16], item[17], item[18], item[20], item[1], item[2], item[3],
#                 item[4], item[5], item[6], item[13], item[16], item[17], item[18], item[20])


#         cursor.execute(add_shots, data)

#         cnx.commit()
#     cursor.close()
#     cnx.close()


# except mysql.connector.Error as err:
#     if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
#         print("Access denied error")
#     elif err.errno == errorcode.ER_BAD_DB_ERROR:
#         print("Database non-existent")
#     else:
#         print(err)
# else:
#     cnx.close()


