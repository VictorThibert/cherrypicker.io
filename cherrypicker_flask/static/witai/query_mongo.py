# houses all the querying logic to wit.ai

import sys
#sys.path.append('../') # temporary measure for ipython -------------- (and remove .. from python.scrape)

from wit import Wit
from ..python.scrape import mongo_helper
from wit.wit import WitError
import dateutil.parser as parser
import calendar
import datetime

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

def is_year_only(date_range):
    date_range = date_range.strip()
    return date_range.isdigit()

def date_to_date_range(date):
    custom_parser = parser.parser()
    raw_date, skipped = custom_parser._parse(date)

    date_info = {}
    for attribute in ('day', 'month', 'year'):
        value = getattr(raw_date, attribute, None)
        if value is not None:
            date_info[attribute] = value

    from_date = None
    to_date = None

    if 'day' in date_info.keys(): # if day is present
        from_date = parser.parse(date)
        to_date = from_date
    elif 'month' in date_info.keys(): # month but no day
        date_time = parser.parse(date)
        from_date = date_time.replace(day=1)
        to_date = date_time.replace(day=calendar.monthrange(date_time.year, date_time.month)[1]) # monthrange used to determine last day of the month
    else: # year only
        date_time = parser.parse(date)
        from_date = date_time.replace(day = 1, month = 10, year = date_time.year - 1)  # replace these dates with start and end of nba seasons
        to_date = date_time.replace(day = 1, month = 5)
    return [from_date.isoformat(), to_date.isoformat()]

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
    else: # single date, single month, or single year
        return date_to_date_range(date_range)


# run called from flask route
def ask(query_string):
    
    entities = None
    result_set = {}

    try:
        wit_response = client.message(query_string)
        entities = wit_response['entities']
        if not entities:
            return 'noEntities'
    except WitError:
        return 'witError'

    print('entities', entities)

    # format of entities is like
    # {
    #   'NBA_stat':[ {type: , value: , metadata: , confidence: ,}, {}, ...],
    #   'NBA_player':[ {}, {}, ...],
    #   'characteristic':[ {}, {}, ...],
    #   ...
    # }
    # types of queries so far
    # characteristic: weight, age, height, etc.
    # nba_stat and date range (points, assists, rebounds)
    #   sum
    #   averages
    #   games played

    player_all = all_entities(entities, 'NBA_player', 'metadata')
    nba_stat_all = all_entities(entities, 'NBA_stat', 'value')
    characteristic_all = all_entities(entities,'characteristic')
    date_range_all = all_entities(entities, 'date_range')   
    query_dates = parse_date(str((datetime.datetime.now()).year))

    if date_range_all is not None:
        date_range_1 = date_range_all[0]
        query_dates = parse_date(date_range_1)

    if player_all is not None:
        player_1 = player_all[0]
        player_data = list(players.find({'player_id':int(player_1)}))[0]
        
        if characteristic_all is not None: # query about characteristic (weight, age, height)
            characteristic = characteristic_all[0]
            if characteristic == 'age':
                characteristic = 'birth_date'
            result_set[characteristic] = player_data[characteristic]

        if nba_stat_all is not None: # query about a stat

            nba_stat = nba_stat_all[0]

            game_log = player_data['game_log']
            query_games = []
            sum_of_stat = 0
            count = 0

            for game in game_log:
                date = game['game_date']
                game_id = game['game_id']
                
                if date >= query_dates[0] and date <= query_dates[1]:
                    query_games.append(game_id)

            box_scores = list(games.find({'box_score.player_id':int(player_1),'game_id':{'$in':query_games}},{'box_score.$':1, '_id':0}))

            for box_score in box_scores:
                box_score = box_score['box_score'][0]
                sum_of_stat += box_score[nba_stat]
                count += 1
        
            result_set[nba_stat] = sum_of_stat
            result_set['count'] = count


    return str(result_set)

mongo_helper.client.close()