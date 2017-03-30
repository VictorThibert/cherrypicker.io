# scrape all player x y shot locations (async)
#
# see:      github.com/seemethere/nba_py/wiki/stats.nba.com-Endpoint-Documentation for complete endpoint documention
# format:   stats.nba.com/stats/{endpoint}/?{params}
#
# full url: http://stats.nba.com/stats/shotchartdetail?AheadBehind=&CFID=33&CFPARAMS=2016-17
#           &ClutchTime=&Conference=&ContextFilter=&ContextMeasure=FGA&DateFrom=&DateTo=&Division=
#           &EndPeriod=10&EndRange=28800&GROUP_ID=&GameEventID=&GameID=&GameSegment=&GroupID=
#           &GroupMode=&GroupQuantity=5&LastNGames=0&LeagueID=00&Location=&Month=0&OnOff=
#           &OpponentTeamID=0&Outcome=&PORound=0&Period=0&PlayerID=201939&PlayerID1=&PlayerID2=
#           &PlayerID3=&PlayerID4=&PlayerID5=&PlayerPosition=&PointDiff=&Position=&RangeType=0
#           &RookieYear=&Season=2016-17&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=
#           &StartPeriod=1&StartRange=0&StarterBench=&VsConference=&VsDivision=&VsPlayerID1=
#           &VsPlayerID2=&VsPlayerID3=&VsPlayerID4=&VsPlayerID5=&VsTeamID=&TeamID=

import requests
import mongo_helper
import asyncio
import async_helper
import dateutil.parser as parser

def format_year(year):
    year1 = str(year)
    year2 = str(year + 1)[-2:]
    return year1 + '-' + year2

def format_url(url_prefix, player_id, year):
    return url_prefix + '&Season=' + format_year(year) + '&PlayerID=' + str(player_id)

def int_with_none(x):
    if str(x).isdigit():
        return int(x)
    else:
        return 0

def populate_names(player_id_list):
    for player_id in player_id_list:
        # make sure that player doesn't already exist in db. this is a temporary measure to avoid duplicates in testing ---------
        if len(list(player_shots.find({'player_id':player_id}))) < 1:
            for game_object in list(players.find({'player_id':player_id}))[0]['game_log']:
                game_id = game_object['game_id']

                player_shots.update_one(
                    {
                        'player_id':player_id, 
                    },
                    {
                        '$addToSet':
                        {
                            'games':
                                {
                                    'game_id':game_id, 
                                    'shots':[]
                                }
                        }
                    },
                    upsert=True
                )

url =   'http://stats.nba.com/stats/shotchartdetail?' \
        '&ContextMeasure=FGA' \
        '&DateFrom=' \
        '&DateTo=' \
        '&EndPeriod=10' \
        '&EndRange=28800' \
        '&GameEventID=' \
        '&GameID=' \
        '&GameSegment=' \
        '&LastNGames=0' \
        '&LeagueID=00' \
        '&Location=' \
        '&Month=0' \
        '&OnOff=' \
        '&OpponentTeamID=0' \
        '&Outcome=' \
        '&PORound=0' \
        '&Period=0' \
        '&PlayerPosition=' \
        '&Position=' \
        '&RangeType=0' \
        '&RookieYear=' \
        '&SeasonSegment=' \
        '&SeasonType=Regular+Season' \
        '&ShotClockRange=' \
        '&StartPeriod=1' \
        '&StartRange=0' \
        '&StarterBench=' \
        '&VsConference=' \
        '&VsDivision=' \
        '&VsTeamID=' \
        '&TeamID=0'         

player_shots = mongo_helper.db.player_shots
players = mongo_helper.db.players
games = mongo_helper.db.games

player_id_list = [element['player_id'] for element in list(players.find({'player_id':{'$gte':701, '$lte':800}}))]
populate_names(player_id_list)

url_list = []

for player_id in player_id_list:
    # find out first player year and last player year (only want to generate valid urls for years that players have played in)
    player_years = (
        int(list(players.find({'player_id':player_id}))[0]['years_active']['from']), # from year
        int(list(players.find({'player_id':player_id}))[0]['years_active']['to']) + 1 # to year + 1
    )

    # use * to unpack tuple
    year_list = [x for x in range(*player_years)]
    for year in year_list:
        url_list.append(format_url(url, player_id, year))

# temporary container variable to extract the result from async request (find a better way to do this)
memo = [None]
loop = asyncio.get_event_loop()
future = asyncio.ensure_future(async_helper.run_url(url_list, memo))
loop.run_until_complete(future)
# returned_tasks will contain the each json file for each player's http request 
returned_tasks = memo[0]

print("-------------Mongo Entry-------------")
        
for json_page in returned_tasks:
    print(json_page['parameters']['PlayerID'], json_page['parameters']['Season'] )
    all_shots = json_page['resultSets'][0]['rowSet']

    for shot in all_shots:
        game_id = str(shot[1])
        game_event_id = shot[2] # used as unique identifier within a game
        player_id = int_with_none(shot[3])
        player_name = shot[4]
        team_id = shot[5]
        team_name = shot[6]
        period = shot[7]
        minutes_remaining = shot[8]
        seconds_remaining = shot[9]
        shot_description = shot[11]
        fg_type = shot[12]
        shot_zone_area = shot[14]
        shot_distance = shot[16]
        loc_x = shot[17]
        loc_y = shot[18]
        shot_made = shot[20]
        game_date = str((parser.parse(shot[21])).isoformat())

        player_shots.update_one(
            # condition on correct player TODO: prevent duplicate addition with $ne
            {'player_id':player_id, 'games.game_id':game_id, 'games.shots.game_event_id':{'$ne':game_event_id}},
            {'$addToSet':
                {'games.$.shots':
                    {   
                        'game_id':game_id,
                        'game_event_id':game_event_id,
                        'period':period,
                        'minutes_remaining':minutes_remaining,
                        'seconds_remaining':seconds_remaining,
                        'shot_description':shot_description,
                        'fg_type':fg_type,
                        'shot_zone_area':shot_zone_area,
                        'loc_x':loc_x,
                        'loc_y':loc_y,
                        'shot_made':shot_made
                    }

                },
            
            '$set':
                {   
                    'player_id':player_id,
                    'player_name':player_name,
                    'games.$.game_id':game_id,
                    'games.$.team_id':team_id,
                    'games.$.team_name':team_name,
                    'games.$.game_date':game_date
                }

            }

            
            
        )


