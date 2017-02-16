import csv
import json
import requests
import mysql.connector
from mysql.connector import errorcode

season = "2014-15"
gameIDprefix = "002140"
seasonType = "Regular+Season"
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0'}

for i in range(1, 1231):
    gameID = gameIDprefix + str(i).zfill(4)
    print(gameID)
    url = "http://stats.nba.com/stats/boxscoretraditionalv2?EndPeriod=10&EndRange=28800&GameID="+ gameID +"&RangeType=1&Season=" + season + "&SeasonType=" \
          + seasonType +"&StartPeriod=1&StartRange=0"

    url2 = "http://stats.nba.com/stats/boxscoresummaryv2?GameID=" + gameID + ""

    response2 = requests.get(url2, headers = headers)
    response2.raise_for_status()
    dates = response2.json()

    dateUnformatted = dates["resultSets"][0]["rowSet"][0][5]
    dateFormatted = dateUnformatted[:-7]


    response = requests.get(url, headers = headers)
    response.raise_for_status()
    shots = response.json()

    try:
        cnx = mysql.connector.connect(user='all', password='all', host='localhost', database='2014-2015')
        cursor = cnx.cursor()
        for item in shots["resultSets"][1]["rowSet"]:


            add_shots = ("INSERT INTO `2014-2015gamedata` (GAMECODE, GAME_ID, GAME_DATE_EST, TEAM_ID, TEAM_ABBREVIATION, WIN, "
                         "PTS, FG_PCT, FT_PCT, FG3_PCT, AST, REB, STL, BLK, TOV, PLUS_MINUS) VALUES "
                         "(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                         "ON DUPLICATE KEY UPDATE GAMECODE=%s, GAME_ID=%s, GAME_DATE_EST=%s, TEAM_ID=%s, TEAM_ABBREVIATION=%s, WIN=%s, "
                         "PTS=%s, FG_PCT=%s, FT_PCT=%s, FG3_PCT=%s, AST=%s, REB=%s, STL=%s, BLK=%s, TOV=%s, PLUS_MINUS=%s")

            win = ((item[24] / abs(item[24]) + 1)/2)



            data = (str(item[0]) + item[3], str(item[0]), dateFormatted, item[1], item[3], win, item[23], item[8], item[14], item[11], item[18], item[17],
                    item[19], item[20], item[21], item[24],
                    str(item[0]) + item[2], str(item[0]), dateFormatted, item[1], item[3], win, item[23], item[8], item[14], item[11], item[18], item[17],
                    item[19], item[20], item[21], item[24],)


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