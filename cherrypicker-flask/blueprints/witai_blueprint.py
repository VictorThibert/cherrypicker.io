import flask
from flask import Blueprint

#url prefix for all witai related functions
witai_blueprint = Blueprint('witai', __name__, url_prefix='/witai')

#under add routes