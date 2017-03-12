# scrape all player common info (async)
# to be run after the player names have been inputted
#
# see:      github.com/seemethere/nba_py/wiki/stats.nba.com-Endpoint-Documentation for complete endpoint documention
# format:   stats.nba.com/stats/{endpoint}/?{params}
# example:  http://stats.nba.com/stats/commonallplayers/?LeagueID=00&Season=2015-16&IsOnlyCurrentSeason=0
#
# birth_date
# school
# country
# height
# weight
# roster_status
# current_team_id
# current_team_name
# from_year
# to_year
# draft_year
# draft_position (round and number)

import requests
import mongo_helper
import asyncio
import async_helper

url = 'http://stats.nba.com/stats/commonplayerinfo/?PlayerID='

# players currently refers to the 'players' collection
players = mongo_helper.db.players

# the find result referes to a cursor, which needs to be closed. save it into a list first and extract just the player ids
player_id_list = [element['player_id'] for element in list(players.find({'player_id':2544},{'_id':0, 'player_id':1}))]

# temporary container variable to extract the result from async request (find a better way to do this)
memo = [None]
loop = asyncio.get_event_loop()
future = asyncio.ensure_future(async_helper.run(player_id_list, url, memo))
loop.run_until_complete(future)
# returned_tasks will contain the each json file for each player's http request 
returned_tasks = memo[0]

# insert into mongo
for json_page in returned_tasks:
    item = json_page['resultSets'][0]['rowSet'][0]

    player_id = int(item[0])
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
        {'player_id':player_id}, 
        # insert the following document (using $set to add new fields without deleting existing fields)
        { '$set':
            {
                'birth_date':birth_date,
                'school':school,
                'country':country,
                'height':height,
                'weight':weight,
                'roster_status':roster_status,
                'current_team_id':current_team_id,
                'current_team_name':current_team_name,
                'years_active':years_active,
                'draft_year':draft_year,
                'draft_position':draft_position
            }

        },
        # creates a new document if no document matches the criteria
        upsert=True)

mongo_helper.client.close()