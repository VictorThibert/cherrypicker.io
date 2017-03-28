# scrape all player x y shot locations (async)
#
# see:      github.com/seemethere/nba_py/wiki/stats.nba.com-Endpoint-Documentation for complete endpoint documention
# format:   stats.nba.com/stats/{endpoint}/?{params}
#
# full url: http://stats.nba.com/stats/shotchartdetail?AheadBehind=&CFID=33&CFPARAMS=2016-17
#			&ClutchTime=&Conference=&ContextFilter=&ContextMeasure=FGA&DateFrom=&DateTo=&Division=
#			&EndPeriod=10&EndRange=28800&GROUP_ID=&GameEventID=&GameID=&GameSegment=&GroupID=
#			&GroupMode=&GroupQuantity=5&LastNGames=0&LeagueID=00&Location=&Month=0&OnOff=
#			&OpponentTeamID=0&Outcome=&PORound=0&Period=0&PlayerID=201939&PlayerID1=&PlayerID2=
#			&PlayerID3=&PlayerID4=&PlayerID5=&PlayerPosition=&PointDiff=&Position=&RangeType=0
#			&RookieYear=&Season=2016-17&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=
#			&StartPeriod=1&StartRange=0&StarterBench=&VsConference=&VsDivision=&VsPlayerID1=
#			&VsPlayerID2=&VsPlayerID3=&VsPlayerID4=&VsPlayerID5=&VsTeamID=&TeamID=

import requests
import mongo_helper
import asyncio
import async_helper

def format_year(year):
    year1 = str(year)
    year2 = str(year + 1)[-2:]
    return year1 + '-' + year2

def format_url(url_prefix, player_id, year):
    return url_prefix + '&Season=' + format_year(year) + '&PlayerID=' + str(player_id)

def int_with_none(x):
    if str(x).isdigit():
        return int(x)
    else:
        return 0

player_shots = mongo_helper.db.player_shots

url = 	'http://stats.nba.com/stats/shotchartdetail?' \
		'&CFPARAMS=2016-17' \
		'&ContextMeasure=FGA' \
		'&DateFrom=' \
		'&DateTo=' \
		'&EndPeriod=10' \
		'&EndRange=28800' \
		'&GameEventID=' \
		'&GameID=' \
		'&GameSegment=' \
		'&LastNGames=0' \
		'&LeagueID=00' \
		'&Location=' \
		'&Month=0' \
		'&OnOff=' \
		'&OpponentTeamID=0' \
		'&Outcome=' \
		'&PORound=0' \
		'&Period=0' \
		'&PlayerPosition=' \
		'&Position=' \
		'&RangeType=0' \
		'&RookieYear=' \
		'&SeasonSegment=' \
		'&SeasonType=Regular+Season' \
		'&ShotClockRange=' \
		'&StartPeriod=1' \
		'&StartRange=0' \
		'&StarterBench=' \
		'&VsConference=' \
		'&VsDivision=' \
		'&VsTeamID=' \
		'&TeamID=0' 
		 
		

