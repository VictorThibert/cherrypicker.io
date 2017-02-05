import sys
from wit import Wit

if len(sys.argv) != 2:
    print('usage: python ' + sys.argv[0] + ' <wit-token>')
    sys.exit(1)
access_token = sys.argv[1]

# Quickstart example
# See https://wit.ai/ar7hur/Quickstart

def first_entity_value(entities, entity):
    if entity not in entities:
        return None
    val = entities[entity][0]['value']
    if not val:
        return None
    return val['value'] if isinstance(val, dict) else val

def send(request, response):
    print(response['text'])

def get_forecast(request):

    context = request['context']
    entities = request['entities']

    loc = first_entity_value(entities, 'location')

    if loc:
        context['forecast'] = 'sunny in ' + loc
        if context.get('missingLocation') is not None:
            del context['missingLocation']
    else:
        context['missingLocation'] = True
        if context.get('forecast') is not None:
            del context['forecast']

    return context

def get_height(request):

    context = request['context']
    entities = request['entities']

    player = str(first_entity_value(entities, 'contact'))

    print("CONTEXT: ", context, " ENTITIES: ", entities)
    context['height'] = '7foot5' + player


    return context

def get_age(request):

    context = request['context']
    entities = request['entities']

    context['age'] = '29'
    return context

def get_characteristic(request):
    context = request['context']
    entities = request['entities']

    val = first_entity_value(entities,'intent')

    if val == 'age':
        context = {}
        context['age'] = '29'
    elif val == 'height':
        context = {}
        context['height'] = '7 foot 5'
    elif val == 'weight':
        context = {}
        context['weight'] = '280 pounds of pure muscle'
    else: 
        context = {}
        print("ERROR")
        #returning an empty context breaks everything

    return context


actions = {
    'send': send,
    'getForecast': get_forecast,
    'getHeight': get_height,
    'getAge': get_age,
    'getCharacteristic': get_characteristic,
}

client = Wit(access_token=access_token, actions=actions)
client.interactive()
