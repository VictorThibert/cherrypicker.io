# template file to scrape from stats.nba.com
#
# see:      github.com/seemethere/nba_py/wiki/stats.nba.com-Endpoint-Documentation for complete endpoint documention
# format:   stats.nba.com/stats/{endpoint}/?{params}
# example:  http://stats.nba.com/stats/commonallplayers/?LeagueID=00&Season=2015-16&IsOnlyCurrentSeason=0
#
# author: Victor Thibert
 
import json
import requests
import pymongo

# set proper headers to allow scraping from NBA website
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0'}

# parameters for endpoints
league_id = '00'
season = '2015-16'
is_only_current_season = '0'

# url 
url = 'http://stats.nba.com/stats/' \
            'commonallplayers/?' \
            'LeagueID=' + league_id + \
            '&Season=' + season + \
            '&IsOnlyCurrentSeason=' +  is_only_current_season

print(url)

response = requests.get(url, headers=headers)
response.raise_for_status()
data = response.json()

for item in data:
    print(item)
