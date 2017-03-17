# scrape all player game logs
#
# see:      github.com/seemethere/nba_py/wiki/stats.nba.com-Endpoint-Documentation for complete endpoint documention
# format:   stats.nba.com/stats/{endpoint}/?{params}
# example:  http://stats.nba.com/stats/playergamelog/?SeasonType=Regular%20Season&Season=2014-15&PlayerID=2544
#
# returns a list of traditonal statlines for a year for a player 

import requests
import mongo_helper
import asyncio
import async_helper

def format_year(year):
    year1 = str(year)
    year2 = str(year + 1)[-2:]
    return year1 + '-' + year2

def format_url(player_id, year):
    return 'http://stats.nba.com/stats/playergamelog/?SeasonType=Regular+Season&Season='+ year +'&PlayerID=' + str(player_id)


# refers to the respective mongo collections
games = mongo_helper.db.games
players = mongo_helper.db.players

player_id_list = [element['player_id'] for element in list(players.find({'player_id':2544}))]

url_list = []
for player_id in player_id_list:
    # find out first player year and last player year (only want to generate valid urls for years that players have played in)
    player_years = (
        int(list(players.find({'player_id':player_id}))[0]['years_active']['from']), # from year
        int(list(players.find({'player_id':player_id}))[0]['years_active']['to']) + 1 # to year + 1
    )

    # use * to unpack tuple
    year_list = [format_year(x) for x in range(*player_years)]
    for year in year_list:
        url_list.append(format_url(player_id, year))





