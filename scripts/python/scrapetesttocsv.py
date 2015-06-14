import csv
import json
import requests

yearA = 2008
yearB = 9

for i in range(8, 15):
    yearA = yearA + 1
    yearB = yearB + 1
    year1 = str(yearA)
    if (i <= 8):
        year2 = "0" + str(yearB)
    else:
        year2 = "" + str(yearB)

    shots_url = "http://stats.nba.com/stats/shotchartdetail?CFID=&CFPARAMS=&ContextFilter=&ContextMeasure=FG_PCT&DateFrom=&DateTo=&GameID=&GameSegment=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&Period=0&PlayerID=0&Position=&RookieYear=&Season=" + year1+ "-" + year2 + "&SeasonSegment=&SeasonType=Regular+Season&TeamID=0&VsConference=&VsDivision=&mode=Advanced&showDetails=1&showShots=0&showZones=1"

    print ( year1 + " " + year2)

    response = requests.get(shots_url)
    response.raise_for_status()
    shots = response.json()

    with open(year1+ "-" + year2 + "allRegularSeasonShots.csv", "w", newline = '') as file:
        csv_file = csv.writer(file)
        for item in shots["resultSets"][0]["rowSet"]:
            csv_file.writerow([item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10], item[11], item[12], item[13], item[14], item[15], item[16], item[17], item[18], item[19], item[20]])