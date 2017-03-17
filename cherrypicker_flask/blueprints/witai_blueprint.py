import sys
import flask
from flask import Blueprint
from flask import Flask, request, send_from_directory, redirect, jsonify
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

# temporary import measure
sys.path.append('..')
from static.witai import query_mongo
sys.path.append('blueprints')


# see: http://flask.pocoo.org/docs/0.12/patterns/jquery/

#url prefix for all witai related functions
witai_blueprint = Blueprint('witai', __name__, url_prefix='/witai')

# temporary 
@witai_blueprint.route('/test')
def test():
	return redirect('/static/witai_test.html')

@witai_blueprint.route('/test/ask_query')
def ask_query():
    query = request.args.get('query', 0, type=str)
    response = query_mongo.ask(query)
    return jsonify(response)

#under add routes