# file connecting to mongodb to be used by all the scrapers
# assumes that mongod is running

import pymongo

client = pymongo.MongoClient('localhost', 27017)

# this is the database name
db = client.cherrypicker



