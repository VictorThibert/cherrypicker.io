from flask import Flask, request, send_from_directory, redirect
from blueprints.blueprints import all_blueprints

#set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='/static')

#remaps base url / to /static/index.html
@app.route('/')
def home_page():
	return redirect('/static/index.html')

#register all blueprints (grouped up set of routes (requests))
for blueprint in all_blueprints:
	app.register_blueprint(blueprint)

if __name__ == "__main__":
    app.run()