import csv
import json
import requests
import mysql.connector
from mysql.connector import errorcode


for i in range (1, 1231):
  i = "000" + str(i)
  i = i[-4:]
  game_id = "002140" + i

  headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0'}
  url = "http://stats.nba.com/stats/boxscoresummaryv2/?GameID=" + game_id +""
  print(url)



  response = requests.get(url, headers=headers)
  response.raise_for_status()
  games = response.json()

  try:
      cnx = mysql.connector.connect(user='all', password='all', host='localhost', database='2014-2015')
      cursor = cnx.cursor()

      for item in games["resultSets"][0]["rowSet"]:

          date = item[0]
          date = date[0:4] + date[5:7] + date[8:10]
          date = int(date)
          print(date)
          add_games = ("INSERT INTO `2014-2015games` (GAME_ID, GAME_DATE_EST, HOME_TEAM_ID, VISITOR_TEAM_ID) VALUES (%s, %s, %s, %s) "
                       "ON DUPLICATE KEY UPDATE GAME_ID=%s, GAME_DATE_EST=%s, HOME_TEAM_ID=%s, VISITOR_TEAM_ID=%s")



          #DOUBLE FOR DUPLICATE
          data = (item[2], date, item[6], item[7], item[2], date, item[6], item[7])


          cursor.execute(add_games, data)

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


