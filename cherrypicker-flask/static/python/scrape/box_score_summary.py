# scrape all box score summary (async)
#
# see:      github.com/seemethere/nba_py/wiki/stats.nba.com-Endpoint-Documentation for complete endpoint documention
# format:   stats.nba.com/stats/{endpoint}/?{params}
# example:  http://stats.nba.com/stats/boxscoresummaryv2/?LeagueID=00&GameID=0021400001
# game_id:  002{YY}0{GGGG} where YY in 20YY-2017 and GGGG is the game number that year (e.g. 1 to 1231)
#
# game_id
# team_id
# game_date
# game_status_id
# game_time
# home_team_id
# visitor_team_id
# season_year
# home_team_abbreviation
# visitor_team_abbreviation
# attendance
# referee objects (ids)
# misc (for both teams: (team_id, team_abbreviation, largest lead, times_tied, lead_changes, pts_2nd_chance, pts_paint, pts_fb, pts_off_to, record ))
# line_score (for both teams: (team_id, team_abbreviation, pts_q1, pts_q2, etc., pts_total))

import requests
import mongo_helper
import asyncio
import async_helper

# generates list assuming 1230 games
def generate_game_ids(leading_from_year, leading_to_year):
    game_id_list = []
    for current in range(leading_from_year, leading_to_year + 1):
        leading_year = str(current)[-2:]
        # following jumble formats each game day to the proper format
        game_id_list.extend(list(map(lambda x: '002' + leading_year + '0' + str('000' + str(x))[-4:], [x for x in range(1, 1231)])))
    return game_id_list

def int_with_none(x):
    if str(x).isdigit():
        return int(x)
    else:
        return 0

url = 'http://stats.nba.com/stats/boxscoresummaryv2/?LeagueID=00&GameID='

# temporary test with 2014-2015(1230 games) -----------------------------------------------------------
game_id_list = generate_game_ids(1960,1964)

# temporary container variable to extract the result from async request (find a better way to do this)
memo = [None]
loop = asyncio.get_event_loop()
future = asyncio.ensure_future(async_helper.run(game_id_list, url, memo))
loop.run_until_complete(future)

# returned_tasks will contain the each json file for each game's http request. make sure to remove the invalid games with the following filter (make this more robust later)
returned_tasks = memo[0]
returned_tasks = list(filter(lambda x: 'resultSets' in x.keys(), returned_tasks))

# games currently refers to the 'games' collection
games = mongo_helper.db.games

# insert into mongo
for json_page in returned_tasks:

    # result set [0] is GameSummary
    item = json_page['resultSets'][0]['rowSet'][0]
    game_date = item[0]
    game_id = item[2] # note, keep it in string format
    game_status_id = int_with_none(item[3])
    home_team_id = int_with_none(item[6])
    visitor_team_id = int_with_none(item[7])
    season_year = int_with_none(item[8])

    games.update_one(
        # condition on game_id
        {'game_id':game_id},
        # insert the following document (using $set to add new fields without deleting existing fields)
        { '$set':
            {
                'game_id':game_id,
                'game_date':game_date,
                'game_status_id':game_status_id,
                'home_team_id':home_team_id,
                'visitor_team_id':visitor_team_id,
                'season_year':season_year
            }
        }, 
        upsert=True)

    # result set [1] is OtherStats. then [0] is first team and [1] is second team
    for item in json_page['resultSets'][1]['rowSet']:
        team_id = int_with_none(item[1])
        team_abbreviation = item[2]
        pts_paint = int_with_none(item[4])
        pts_2nd_chance = int_with_none(item[5])
        pts_fb = int_with_none(item[6])
        pts_off_to = int_with_none(item[13])
        largest_lead = int_with_none(item[7])
        lead_changes = int_with_none(item[8])
        times_tied = int_with_none(item[9])

        misc_team = 'misc_undefined_team'
        # if current team is home team
        if team_id == json_page['resultSets'][0]['rowSet'][0][6]:
            misc_team = 'misc_home_team'
        if team_id == json_page['resultSets'][0]['rowSet'][0][7]:
            misc_team = 'misc_visitor_team'

        games.update_one(
            {'game_id':game_id},
            { '$set':
                {
                    misc_team: {
                        'team_id':team_id,
                        'team_abbreviation':team_abbreviation,
                        'pts_paint':pts_paint,
                        'pts_2nd_chance':pts_2nd_chance,
                        'pts_fb':pts_fb,
                        'pts_off_to':pts_off_to,
                        'largest_lead':largest_lead,
                        'lead_changes':lead_changes,
                        'times_tied':times_tied
                    }
                }
            }, 
            upsert=True)
        
    # result set [2] is Officials. there are multiple officials to iterate over. result set [4] is GameInfo. 
    referees = []
    for referee in json_page['resultSets'][2]['rowSet']:
        referees.append({'referee_id':int_with_none(referee[0])})
    game_time = json_page['resultSets'][4]['rowSet'][0][2]
    attendance = json_page['resultSets'][4]['rowSet'][0][1]

    games.update_one(
        {'game_id':game_id},
        { '$set':
            {
                'referees':referees,
                'game_time':game_time,
                'attendance':attendance
            }
        }, 
        upsert=True)

    # result set [5] is LineScore
    for item in json_page['resultSets'][5]['rowSet']:
        team_id = int_with_none(item[3])
        team_abbreviation = item[4]
        pts_q1 = int_with_none(item[8])
        pts_q2 = int_with_none(item[9])
        pts_q3 = int_with_none(item[10])
        pts_q4 = int_with_none(item[11])
        pts_ot1 = int_with_none(item[12])
        pts_ot2 = int_with_none(item[13])
        pts_ot3 = int_with_none(item[14])
        pts_ot4 = int_with_none(item[15])
        pts_ot5 = int_with_none(item[16])
        pts_ot6 = int_with_none(item[17])
        pts_ot7 = int_with_none(item[18])
        pts_ot8 = int_with_none(item[19])
        pts_total = int_with_none(item[22])

        linescore_team = 'linescore_undefined_team'
        # if current team is home team
        if team_id == json_page['resultSets'][0]['rowSet'][0][6]:
            linescore_team = 'linescore_home_team'
        if team_id == json_page['resultSets'][0]['rowSet'][0][7]:
            linescore_team = 'linescore_visitor_team'

        games.update_one(
            {'game_id':game_id},
            { '$set':
                {
                    linescore_team: {
                        'team_id':team_id,
                        'team_abbreviation':team_abbreviation,
                        'pts_q1':pts_q1,
                        'pts_q2':pts_q2,
                        'pts_q3':pts_q3,
                        'pts_q4':pts_q4,
                        'pts_ot1':pts_ot1,
                        'pts_ot2':pts_ot2,
                        'pts_ot3':pts_ot3,
                        'pts_ot4':pts_ot4,
                        'pts_ot5':pts_ot5,
                        'pts_ot6':pts_ot6,
                        'pts_ot7':pts_ot7,
                        'pts_ot8':pts_ot8,
                        'pts_total':pts_total
                    }
                }
            }, 
            upsert=True)

mongo_helper.client.close()