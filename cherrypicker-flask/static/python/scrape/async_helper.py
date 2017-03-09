# async http request helper file

# to write: batch function

import asyncio
import async_timeout
import aiohttp

# set proper headers to allow scraping from stats.nba.com 
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0'}
batch_size = 100

async def run(player_id_list):
    tasks = []

    # semaphore to process batch sizes of n (don't go over 1000)
    semaphore = asyncio.Semaphore(batch_size)

    with aiohttp.ClientSession() as session:
        for element in player_id_list:
            url = 'http://stats.nba.com/stats/commonplayerinfo/?PlayerID=' + str(element['player_id'])
            print(url)
            task = asyncio.ensure_future(bounded_fetch_page(session, url, semaphore))
            tasks.append(task)

        # responses contains a tuple with two elements. the first element is the set of all the http responses from the tasks
        responses = await asyncio.gather(*tasks)
        print(responses)
        return list(responses[0])

async def fetch_page(session, url):
    print('Fetching player: ' + url[-4:])
    async with session.get(url, headers=headers) as response:
        return await response.json()

async def bounded_fetch_page(session, url, semaphore):
    async with semaphore:
        return await fetch_page(session, url)
