# scrape all player game logs
#
# see:      github.com/seemethere/nba_py/wiki/stats.nba.com-Endpoint-Documentation for complete endpoint documention
# format:   stats.nba.com/stats/{endpoint}/?{params}
# example:  http://stats.nba.com/stats/playergamelog/?SeasonType=Regular%20Season&Season=2014-15&PlayerID=2544
#
# returns a list of traditonal statlines for a year for a player 
# doesn't scrape the data for the statlines but rather links players to existing boxscore items located in the games collection

import requests
import mongo_helper
import asyncio
import async_helper
import bson
import dateutil.parser as parser

def format_year(year):
    year1 = str(year)
    year2 = str(year + 1)[-2:]
    return year1 + '-' + year2

def format_url(player_id, year):
    return 'http://stats.nba.com/stats/playergamelog/?SeasonType=Regular+Season&Season='+ year +'&PlayerID=' + str(player_id)

def int_with_none(x):
    if str(x).isdigit():
        return int(x)
    else:
        return 0

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

# temporary container variable to extract the result from async request (find a better way to do this)
memo = [None]
loop = asyncio.get_event_loop()
future = asyncio.ensure_future(async_helper.run_url(url_list, memo))
loop.run_until_complete(future)
# returned_tasks will contain the each json file for each player's http request 
returned_tasks = memo[0]


for json_page in returned_tasks:
    all_games = json_page['resultSets'][0]['rowSet']

    for game in all_games:
        player_id = int_with_none(game[1])
        game_id = game[2]
        game_date = game[3]
        game_date = (parser.parse(game_date))
        game_date = str(game_date.isoformat())
        wl = game[5]
        object_id = game_id + str('000000' + str(player_id))[-6:] + '00000000'


        players.update_one(
            # condition to correct player and ensure game not already in gamelog
            {'player_id':player_id, 'game_log.game_id':{'$ne':game_id}}, 
            # $addToSet pushes to array if element is new (upserts by default if field for the array doesn't exist yet)
            { '$addToSet':
                {
                    'game_log': {  
                                    'game_id':game_id, 
                                    'game_date':game_date, 
                                    'box_score_object_id':bson.ObjectId(object_id), 
                                    'wl':wl 
                                }
                }
            })