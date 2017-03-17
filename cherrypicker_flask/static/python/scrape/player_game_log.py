# scrape all player game logs
#
# see:      github.com/seemethere/nba_py/wiki/stats.nba.com-Endpoint-Documentation for complete endpoint documention
# format:   stats.nba.com/stats/{endpoint}/?{params}
# example:  http://stats.nba.com/stats/playergamelog/?SeasonType=Regular%20Season&Season=2014-15&PlayerID=2544
#
# returns a list of traditonal statlines for a year for a player 

import requests
import mongo_helper
import asyncio
import async_helper

url = 'http://stats.nba.com/stats/playergamelog/?SeasonType=Regular%20Season&Season=2014-15&PlayerID=2544'


