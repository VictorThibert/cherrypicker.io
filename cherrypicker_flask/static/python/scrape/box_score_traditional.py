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
import bson

def int_with_none(x):
    if str(x).isdigit():
        return int(x)
    else:
        return 0

def isfloat(x):
    try:
        float(x)
        return True
    except ValueError:
        return False

def float_with_none(x):
    if isfloat(str(x)):
        return float(x)
    else:
        return 0.0


url = 'http://stats.nba.com/stats/boxscoretraditionalv2/?LeagueID=00&StartPeriod=0&StartRange=0&EndPeriod=14&EndRange=999999&RangeType=0&GameID='

# games currently refers to the 'games' collection
games = mongo_helper.db.games

# the find result referes to a cursor, which needs to be closed. save it into a list first and extract just the player ids
game_id_list = [game['game_id'] for game in list(games.find({'season_year':{'$in':[2010, 1946]}}))]

# temporary container variable to extract the result from async request (find a better way to do this)
memo = [None]
loop = asyncio.get_event_loop()
future = asyncio.ensure_future(async_helper.run(game_id_list, url, memo))
loop.run_until_complete(future)
# returned_tasks will contain the each json file for each player's http request 
returned_tasks = memo[0]

# insert into mongo
for json_page in returned_tasks:

    # resultSets: [0] PlayerStats // [1] TeamStats // [2] TeamStarterBenchStats
    item = json_page['resultSets'][0]['rowSet']

    game_id = json_page['parameters']['GameID']
    home_team_id = list(games.find({'game_id':game_id},{'_id':0, 'visitor_team_id':1, 'home_team_id':1}))[0]['home_team_id']
    visitor_team_id = list(games.find({'game_id':game_id},{'_id':0, 'visitor_team_id':1, 'home_team_id':1}))[0]['visitor_team_id']

    for player in item:
        team_id = int_with_none(player[1])
        player_id = int_with_none(player[4])
        player_name = player[5]
        start_position = player[6]
        minutes = player[8]
        fgm = int_with_none(player[9])
        fga = int_with_none(player[10])
        fg_pct = float_with_none(player[11])
        fg3m = int_with_none(player[12])
        fg3a = int_with_none(player[13])
        fg3_pct = float_with_none(player[14])
        ftm = int_with_none(player[15])
        fta = int_with_none(player[16])
        ft_pct = float_with_none(player[17])
        orebounds = int_with_none(player[18])
        drebounds = int_with_none(player[19])
        rebounds = int_with_none(player[20])
        assists = int_with_none(player[21])
        steals = int_with_none(player[22])
        blocks = int_with_none(player[23])
        turnovers = int_with_none(player[24])
        fouls = int_with_none(player[25])
        points = int_with_none(player[26])
        plus_minus = float_with_none(player[27])

        is_at_home = 0

        if team_id == home_team_id:
            is_at_home = 1

        # object_id will be first 10 digits: game id, next 6 digits: player_id, next 8: all 0s
        object_id = game_id +  str('000000' + str(player_id))[-6:] + '00000000'

        games.update_one(
            # condition: on player id and ensure that boxscore does not already exist
            {'game_id':game_id, 'box_score.player_id':{'$ne':player_id}}, 
            # $addToSet pushes to array if element is new (upserts by default if field nonexistent) (problem with checking equality on documents)
            { '$addToSet':
                {
                    'box_score': {  '_id': bson.ObjectId(object_id),
                                    'team_id':team_id, 
                                    'player_id':player_id, 
                                    'player_name':player_name, 
                                    'start_position':start_position, 
                                    'minutes':minutes, 
                                    'fgm':fgm, 
                                    'fga':fga, 
                                    'fg_pct':fg_pct, 
                                    'fg3m':fg3m,
                                    'fg3a':fg3a,
                                    'fg3_pct':fg3_pct,
                                    'ftm':ftm,
                                    'fta':fta,
                                    'ft_pct':ft_pct,
                                    'orebounds':orebounds,
                                    'drebounds':drebounds,
                                    'assists':assists,
                                    'steals':steals,
                                    'blocks':blocks,
                                    'turnovers':turnovers,
                                    'fouls':fouls,
                                    'points':points,
                                    'plus_minus':plus_minus,
                                    'is_at_home': is_at_home
                                }
                }
            })
    # for the two team stats
    for item in json_page['resultSets'][1]['rowSet']:
        team_id = item[1]
        minutes = item[5]
        off_rating = float_with_none(item[6])
        def_rating = float_with_none(item[7])
        net_rating = float_with_none(item[8])
        ast_pct = float_with_none(item[9])
        ast_tov = float_with_none(item[10])
        ast_ratio = float_with_none(item[11])
        oreb_pct = float_with_none(item[12])
        dreb_pct = float_with_none(item[13])
        reb_pct = float_with_none(item[14])
        tm_tov_pct = float_with_none(item[15])
        efg_pct = float_with_none(item[16])
        ts_pct = float_with_none(item[17])
        usg_pct = float_with_none(item[18])
        pace = float_with_none(item[19])
        pie = float_with_none(item[20])
        is_at_home = 0

        team = 'undefined_team_stats'
        # if current team is home team
        if team_id == home_team_id:
            team = 'home_team_stats'
            is_at_home = 1
        if team_id == visitor_team_id:
            team = 'visitor_team_stats'

        games.update_one(
            {'game_id':game_id},
            { '$set':
                {
                    team: {
                        'team_id':team_id,
                        'minutes':minutes,
                        'off_rating':off_rating,
                        'def_rating':def_rating,
                        'net_rating':net_rating,
                        'ast_pct':ast_pct,
                        'ast_tov':ast_tov,
                        'ast_ratio':ast_ratio,
                        'oreb_pct':oreb_pct,
                        'dreb_pct':dreb_pct,
                        'reb_pct':reb_pct,
                        'tm_tov_pct':tm_tov_pct,
                        'efg_pct':efg_pct,
                        'ts_pct':ts_pct,
                        'usg_pct':usg_pct,
                        'pace':pace,
                        'pie':pie,
                        'is_at_home':is_at_home
                        
                    }
                }
            }, 
            upsert=True)


mongo_helper.client.close()
