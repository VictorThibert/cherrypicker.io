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

#finds the entity's value among the entities of the request (e.g. for entity intent, the value could be height, age, etc.) 
def first_entity_value(entities, entity):
    if entity not in entities:
        return None
    val = entities[entity][0]['value'] #most probable/confident
    if not val:
        return None
    return val['value'] if isinstance(val, dict) else val

#------------------------------------------------------
#custom functions

def get_characteristic(request):
    context = request['context']
    entities = request['entities']

    val = first_entity_value(entities,'intent')
    player = first_entity_value(entities, 'NBA_player')

    print("CONTEXT ", context)
    print("ENTITIES ", entities)

    context = {} #clear context because no need to memory right now
    if val == 'age':
        context['age'] = '29'
    elif val == 'height':
        context['height'] = '7 foot 5'
    elif val == 'weight':
        context['weight'] = '280 pounds of pure muscle'
    else: 
        print("ERROR" + val)
        #returning an empty context breaks everything

    return context

def generate_query(request):
    context = request['context']
    entities = request['entities']

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
