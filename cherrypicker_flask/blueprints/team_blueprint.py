import sys
import flask
from flask import Blueprint
from flask import Flask, request, send_from_directory, redirect, jsonify
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

# temporary import measure
sys.path.append('..')
from data.witai import query_mongo
sys.path.append('blueprints')


# see: http://flask.pocoo.org/docs/0.12/patterns/jquery/

#url prefix for all witai related functions
team_blueprint = Blueprint('team', __name__, url_prefix='/team')

# temporary 
@team_blueprint.route('/<team_id>')
def blank_team(team_id):
	print(team_id)
	return send_from_directory('static/html', 'team.html')




@team_blueprint.route('/<team_id>/json')
def send_team_json(team_id):
	return 'test'
    

#under add routes