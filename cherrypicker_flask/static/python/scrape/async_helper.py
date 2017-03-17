# async http request helper file

import asyncio
import aiohttp

# set proper headers to allow scraping from stats.nba.com 
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0'}
batch_size = 2000
timeout = 60 * 10000

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
        # return_exceptions parameter makes it so that it doesn't drop all its tasks if en error occurs
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        memo[0] = list(responses)
        return 

async def run_url(url_list, memo):
    tasks = []
    semaphore = asyncio.Semaphore(batch_size)
    with aiohttp.ClientSession() as session:
        for url in url_list:
            task = asyncio.ensure_future(bounded_fetch_page(session, url, semaphore))
            tasks.append(task)
    responses = await asyncio.gather(*tasks, return_exceptions=True)
    memo[0] = list(responses)
    return

async def fetch_page(session, url):
    print('Fetching: ' + url)
    async with session.get(url, headers=headers, timeout=timeout) as response:
        return await response.json()

async def bounded_fetch_page(session, url, semaphore):
    with aiohttp.Timeout(timeout):
        async with semaphore:
            return await fetch_page(session, url)
