# async http request helper file

# to write: batch function

import asyncio
import aiohttp

# set proper headers to allow scraping from stats.nba.com 
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0'}
batch_size = 1000

async def run(player_id_list, url_prefix, memo):
    tasks = []

    # semaphore to process batch sizes of n (don't go over 1000)
    semaphore = asyncio.Semaphore(batch_size)

    with aiohttp.ClientSession() as session:
        for element in player_id_list:
            url = url_prefix + str(element)
            task = asyncio.ensure_future(bounded_fetch_page(session, url, semaphore))
            tasks.append(task)

        # responses contains all the http responses from the tasks
        responses = await asyncio.gather(*tasks)
        memo[0] = list(responses)
        return 

async def fetch_page(session, url):
    print('Fetching: ' + url)
    async with session.get(url, headers=headers) as response:
        return await response.json()

async def bounded_fetch_page(session, url, semaphore):
    async with semaphore:
        return await fetch_page(session, url)
