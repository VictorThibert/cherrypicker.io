import sys
from wit import Wit

#------------------------------------------------------

if len(sys.argv) != 2:
    print('usage: python ' + sys.argv[0] + ' <wit-token>')
    sys.exit(1)
access_token = sys.argv[1]

#------------------------------------------------------

def send(request, response):
    print(response['text'])

#finds the entity's value among the entities of the request (e.g. for entity 'characteristic', the value could be height, age, etc.) 
def first_entity_value(entities, entity):
    if entity not in entities:
        return None
    value = entities[entity][0]['value'] #most probable/confident
    if value == None:
        return None
    return value['value'] if isinstance(value, dict) else value

#------------------------------------------------------
#custom functions

def get_characteristic(request):
    context = {} #clear context because no need to memory right now
    entities = request['entities']

    characteristic = first_entity_value(entities,'characteristic')
    player = first_entity_value(entities, 'NBA_player') #extend this later for multiple players

    context['NBA_player'] = player

    if characteristic == 'age':
        context['age'] = '29'
    elif characteristic == 'height':
        context['height'] = '7 foot 5'
    elif characteristic == 'weight':
        context['weight'] = '280 pounds of pure muscle'
    else: 
        print("ERROR" + characteristic)
        #returning an empty context breaks everything

    return context

def generate_query(request):
    context = {}
    entities = request['entities']

    stat = first_entity_value(entities,'NBA_stat')
    player = first_entity_value(entities, 'NBA_player')
    time_range = first_entity_value(entities, 'time_range')

    context['NBA_player'] = player

    if time_range == None:
        if stat == 'points':
            context['points'] = '30,000 points'
        elif stat == 'assists':
            context['assists'] = '10,000 assists'
        elif stat == 'rebounds'
    else:
        if stat == 'points':
            context['points'] = '30,000 points in 10 years'
        elif stat == 'assists':
            context['assists'] = '10,000 assists in 10 years'

    return context

#------------------------------------------------------


actions = {
    'send': send,
    'getCharacteristic': get_characteristic,
    'generateQuery':generate_query,
}

#------------------------------------------------------

client = Wit(access_token=access_token, actions=actions)
client.interactive()
