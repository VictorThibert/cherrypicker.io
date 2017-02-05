import json
import requests
import mysql.connector
from mysql.connector import errorcode

#retriev calendar data from mysql db

try:
    #start connection
    cnx = mysql.connector.connect(user='all', password='all', host='localhost', database="2014-2015")
    cursor = cnx.cursor()

    query = ('SELECT GAME_ID, GAME_DATE_EST, HOME_TEAM_ID, VISITOR_TEAM_ID, HOME_POINTS, AWAY_POINTS, MATCHUP FROM `2014-2015games` ')

    # sql = ('UPDATE `2014-2015games` SET HOME_POINTS = %s, MATCHUP = %s WHERE HOME_TEAM_ID = %s AND GAME_ID = %s')
    # data = (home_points, matchup, home_team_id, game_id)


#still have to import team IDS
    cursor.execute(query)

    for team in cursor:
        print(team)

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


