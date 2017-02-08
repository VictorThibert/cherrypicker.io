from __future__ import print_function
import mysql.connector
from mysql.connector import errorcode

import requests

try:
    cnx = mysql.connector.connect(user='all', password='all', host='localhost', database='atlanta')

except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Access denied error")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database non-existent")
    else:
        print(err)
else:
    cnx.close()


cursor = cnx.cursor()
#
# add_rec = ("INSERT INTO wl "
#                "(year, w, l) "
#                "VALUES (%s, %s, %s)")
#
# while (y < 19):
#
#
#     bb = str((year2 - y) % 100)
#
#     if (float(bb) < 10):
#         bb = "0" + bb
#
#
#     yr2 = "0" + str(year2 - y)
#     shots_url = 'http:
#
#     response = requests.get(shots_url)
#     response.raise_for_status()
#     shots = response.json()['resultSets'][2]['rowSet']
#     i = 0
#
#     #print( str(year1 - y) + '-' + bb + ":  " + "{0:.3f}".format((shots[0][3]+0.0)/(shots[0][3]+ shots[1][3] + 0.0)))
#
#     data_rec = (1999+(year2 - y),(shots[0][3]+0.0), (shots[1][3] + 0.0))
#     cursor.execute(add_rec, data_rec)
#     cnx.commit()
#
#     y += 1
# cursor.close()
# cnx.close()
