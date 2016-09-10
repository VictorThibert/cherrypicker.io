import json
import requests
import mysql.connector
from mysql.connector import errorcode

season = "2014-15"
gameIDprefix = "002140"
seasonType = "Regular+Season"

# to allow smooth scraping without being blocked out
URLheaders = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0'}

for i in range(37, 67):
  url = "http://stats.nba.com/stats/teamgamelog?TeamID=16106127" + teamID + "&Season=" + season + "&SeasonType=" + seasonType + ""

  response = requests.get(url, headers=URLheaders)
  response.raise_for_status()
  data = response.json()
  
  try:
      cnx = mysql.connector.connect(user='all', password='all', host='localhost', database=season)
      cursor = cnx.cursor()

      for item in data["resultSets"][0]["rowSet"]:
          home_team_id = item[0]
          game_id = item[1]
          matchup = item[2]
          home_points = iteam[26]
          sql = ("UPDATE `2014-2015games` SET (HOME_POINTS, MATCHUP) VALUES (%s, %s) WHERE HOME_TEAM_ID = %s AND GAME_ID = %s")
          
          # match each %s
          data = (home_points, matchup, home_team_id, game_id)

          cursor.execute(sql, data)
          
          sql2 = ("UPDATE `2014-2015games` SET (AWAY_POINTS) VALUES (%s) WHERE VISITOR_TEAM_ID = %s AND GAME_ID = %s")
          data = (home_points, home_team_id, game_id)

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