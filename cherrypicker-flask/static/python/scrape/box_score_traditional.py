# scrape all box score summary (async)
#
# see:      github.com/seemethere/nba_py/wiki/stats.nba.com-Endpoint-Documentation for complete endpoint documention
# format:   stats.nba.com/stats/{endpoint}/?{params}
# example:  http://stats.nba.com/stats/boxscoretraditonalv2/?LeagueID=00&StartPeriod=0&StartRange=0&EndPeriod=14&EndRange=999999&RangeType=0&GameID=0021400001
#
# game_id
# PlayerStats / TeamStats / TeamStarterBenchStats

import requests
import mongo_helper
import asyncio
import async_helper

def int_with_none(x):
    if str(x).isdigit():
        return int(x)
    else:
        return 0

url = 'http://stats.nba.com/stats/boxscoretraditonalv2/?LeagueID=00&StartPeriod=0&StartRange=0&EndPeriod=14&EndRange=999999&RangeType=0&GameID='

# games currently refers to the 'games' collection
games = mongo_helper.db.games

# the find result referes to a cursor, which needs to be closed. save it into a list first and extract just the player ids
game_id_list = [game['game_id'] for game in list(games.find({},{'_id':0, 'game_id':1}))]

# temporary container variable to extract the result from async request (find a better way to do this)
memo = [None]
loop = asyncio.get_event_loop()
future = asyncio.ensure_future(async_helper.run(game_id_list, url, memo))
loop.run_until_complete(future)
# returned_tasks will contain the each json file for each player's http request 
returned_tasks = memo[0]

# insert into mongo
for json_page in returned_tasks:

    # resultSets: [0] PlayerStats [1] TeamStats [2] TeamStarterBenchStats
    item = json_page['resultSets'][0]['rowSet']

    for player in item:
        team_id = int_with_none(player[1])
        player_id = int_with_none(player[4])
        player_name = player[5]
        start_position = player[6]
        
    birth_date = item[6]
    school = item[7]
    country = item[8]
    height = item[10]
    if str(item[11]).isdigit():
        weight = int(item[11])
    else:
        weight = 0

    roster_status = item[15]

    if str(item[16]).isdigit():
        current_team_id = int(item[16])
    else:
        current_team_id = 0

    current_team_name = item[17]

    if str(item[22]).isdigit() and str(item[23]).isdigit():
        years_active = {'from':int(item[22]), 'to':int(item[23])}
    else:
        years_active = {'from':0, 'to':0}

    if str(item[26]).isdigit():
        draft_year = int(item[26])
    else:
        draft_year = 0

    if str(item[27]).isdigit() and str(item[28]).isdigit():
        draft_position = {'round':int(item[27]), 'number':int(item[28])}
    else:
        draft_position = {'round':0, 'number':0}

    players.update_one(
        # condition: on player id
        {'game_id':game_id}, 
        # insert the following document (using $set to add new fields without deleting existing fields)
        { '$set':
            {
                'birth_date':birth_date,

            }

        },
        # creates a new document if no document matches the criteria
        upsert=True)

mongo_helper.client.close()
