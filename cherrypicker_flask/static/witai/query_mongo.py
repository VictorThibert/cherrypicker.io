# houses all the querying logic to wit.ai

import sys
sys.path.append('../') # temporary measure for ipython

from wit import Wit
from python.scrape import mongo_helper
from wit.wit import WitError
import dateutil.parser as parser
import calendar

# server token: HVAI5NNFRSFNWCDR7U3U4KBDS4FBDM25
# client token: IRDFALXOU75Q4HBP2TYIDCSVV4LCMTFY
players = mongo_helper.db.players
games = mongo_helper.db.games

# finds the entity's value among the entities of the request (e.g. for entity 'characteristic', the value could be height, age, etc.) 
def first_entity_value(entities, entity):
    if entity not in entities:
        return None
    value = entities[entity][0]['value'] #most probable/confident
    if value == None:
        return None
    return value['value'] if isinstance(value, dict) else value

def first_entity_metadata(entities, entity):
    if entity not in entities:
        return None
    try:
        value = entities[entity][0]['metadata'] #most probable/confident
    except KeyError: # no metadata 
        print('No metadata')
        return None
    if value == None:
        return None
    return value['metadata'] if isinstance(value, dict) else value

def all_entities(entities, entity, key='value'):
    if entity not in entities:
        return None
    
    value_objects = entities[entity]
    values = []
    for value_object in value_objects:
        values.append(value_object[key])
    if values == []: # empty values
        return None
    return values


# witai setup 
access_token = 'IRDFALXOU75Q4HBP2TYIDCSVV4LCMTFY'
actions = {}
client = Wit(access_token=access_token, actions=actions)

def parse_date(date_range):
    # if no year is provided parser 'seems' to use current year
    if 'from' in date_range: 
        date_range = date_range.split('from ',1)[1] # eliminates the from
        date_range_from = date_range.split(' to ')[0]
        date_range_from = (parser.parse(date_range_from)).isoformat()
        date_range_to = date_range.split(' to ')[1]
        date_range_to = (parser.parse(date_range_to)).isoformat()
        return [date_range_from, date_range_to]
    elif 'between' in date_range:
        date_range = date_range.split('between ',1)[1] # eliminates the from
        date_range_from = date_range.split(' and ')[0]
        date_range_from = (parser.parse(date_range_from)).isoformat()
        date_range_to = date_range.split(' and ')[1]
        date_range_to = (parser.parse(date_range_to)).isoformat()
        return [date_range_from, date_range_to]
    else: # single date
        date = (parser.parse(date_range)).isoformat()
        return [date]

# run called from flask route
def ask(query_string):
    
    # automate this part, hardcoded for testing purposes
    current_year = 2016
    current_month = 3

    entities = None

    try:
        wit_response = client.message(query_string)
        entities = wit_response['entities']
        if not entities:
            return 'noEntities'
    except WitError:
        return 'witError'

    # format of entities is like
    # {
    #   'NBA_stat':[ {type: , value: , metadata: , confidence: ,}, {}, ...],
    #   'NBA_player':[ {}, {}, ...],
    #   'characteristic':[ {}, {}, ...],
    #   ...
    # }

    print('entities', entities)

    # types of queries so far
    # characteristic: weight, age, height, etc.
    # nba_stat and date range (points, assists, rebounds)
    #   sum
    #   averages
    #   games played

    player_list = all_entities(entities, 'NBA_player', 'metadata')
    player_1 = player_list[0]
    print(player_list)
    nba_stat = first_entity_value(entities, 'NBA_stat')
    characteristic = first_entity_value(entities,'characteristic')

    if characteristic == 'age':
        characteristic = 'birth_date'

    
    if not player_1:
        return 'no player selected'

    # not yet suited for multiple dates ranges (only works for first date_range argument)
    date_range_1 = first_entity_value(entities, 'date_range')
    query_dates = parse_date(date_range_1)

    # [0] needed to retrieve form cursor
    result = list(players.find({'player_id':int(player_1)}))[0]
    
    game_log = result['game_log']
    query_games = []
    sum_of_stat = 0

    print(query_dates)
    for game in game_log:
        date = game['game_date']
        game_id = game['game_id']
        
        if date >= query_dates[0] and date <= query_dates[1]:
            query_games.append(game_id)

    box_scores = list(games.find({'game_id':{'$in':query_games}},{'box_score':1}))

    for box_score in box_scores:
        box_score = box_score['box_score']
        for player_stat_line in box_score:
            if str(player_stat_line['player_id']) == str(player):
                sum_of_stat += player_stat_line[nba_stat]


    if characteristic:
        result = result[characteristic]

    # temporary, change
    result = sum_of_stat
    return result

mongo_helper.client.close()