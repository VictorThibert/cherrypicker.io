from flask import Flask, request, send_from_directory, redirect, send_file
from blueprints.blueprints import all_blueprints
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='/static')
# allows cross origin requests
CORS(app)

# remaps base url / to /static/index.html
@app.route('/')
def home_page():
	return send_from_directory('static/html', 'index.html')

# for testing purposes for react 
@app.route('/react')
def react_page():
	return send_from_directory('static/html', 'react.html')

# register all blueprints (grouped up set of routes (requests))
for blueprint in all_blueprints:
	app.register_blueprint(blueprint)

if __name__ == "__main__":
    app.run()