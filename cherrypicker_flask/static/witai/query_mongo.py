import sys
from wit import Wit
from ..python.scrape import mongo_helper
from wit.wit import WitError
# server token: HVAI5NNFRSFNWCDR7U3U4KBDS4FBDM25
# client token: IRDFALXOU75Q4HBP2TYIDCSVV4LCMTFY
players = mongo_helper.db.players

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

# witai setup
access_token = 'IRDFALXOU75Q4HBP2TYIDCSVV4LCMTFY'
actions = {}
client = Wit(access_token=access_token, actions=actions)

# run called from flask route
def ask(query_string):
    result = 'unknown query, sorry :('
    entities = None

    try:
        wit_response = client.message(query_string)
        entities = wit_response['entities']
    except WitError:
        return result

    if not entities:
        return result

    characteristic = first_entity_value(entities,'characteristic')
    player = first_entity_metadata(entities, 'NBA_player') #extend this later for multiple players

    if characteristic == 'age':
        characteristic = 'birth_date'

    if not player or not characteristic:
        return result

    result = list(players.find({'player_id':int(player)}))[0]
    result = result[characteristic]

    

    return result

mongo_helper.client.close()