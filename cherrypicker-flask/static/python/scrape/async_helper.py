# async http request helper file

# to write: batch function

import asyncio
import async_timeout
import aiohttp

# set proper headers to allow scraping from stats.nba.com 
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0'}

# semaphore to process batch sizes of n (don't go over 1000)
semaphore = asyncio.Semaphore(100)


@asyncio.coroutine
def fetch_page(session, url, semaphore):
    print('Fetching player: ' + url[-4:])
    # set timeout for longer in case of errors
    with aiohttp.Timeout(100):
        response = yield from session.get(url, headers=headers)
        try:
            return (yield from response.json())
        finally:
            yield from response.release()