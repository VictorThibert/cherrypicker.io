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

grid = []
unique_id = 0

for i in range(-25, 25):
    for j in range(-5, 30):
        grid += [{'xBin': i, 'yBin': j, 'attempted': 0, 'made': 0}]


try:
    cnx = mysql.connector.connect(user='all', password='all', host='localhost', database='2014-2015')
    cursor = cnx.cursor()

    for item in shots["resultSets"][0]["rowSet"]:
        for bin in grid:
            if item[17] >= bin['xBin'] * 10 - 5 and item[17] < bin['xBin'] * 10 + 5 and item[18] >= bin['yBin'] * 10 - 5 and item[18] < bin['yBin'] * 10 + 5:
                bin['attempted'] += 1
                bin['made'] += item[20]



    for item in grid:

        add_shots = ("INSERT INTO `2014-2015locationpercentages` (UNIQUE_ID, LOC_X, LOC_Y, MADE, ATTEMPTED, PERCENTAGE) VALUES (%s, %s, %s, %s, %s, %s)"
                   "ON DUPLICATE KEY UPDATE LOC_X=%s, LOC_Y=%s, MADE=%s, ATTEMPTED=%s, PERCENTAGE=%s")


        if item['attempted'] != 0:
            percentage = float(item['made'])/float(item['attempted'])
        else:
            percentage = 0.0

        data = (unique_id, item['xBin'] * 10, item['yBin'] * 10, item['made'], item['attempted'], percentage, item['xBin'], item['yBin'], item['made'],
                item['attempted'], percentage)
        unique_id += 1


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


