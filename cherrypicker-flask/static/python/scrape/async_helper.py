# async http request helper file

# to write: batch function

import asyncio
import async_timeout
import aiohttp

@asyncio.coroutine
def fetch_page(session, url):
    print('Fetching player: ' + url[-4:])
    # set timeout for longer in case of errors
    with aiohttp.Timeout(100):
        response = yield from session.get(url, headers=headers)
        try:
            return (yield from response.json())
        finally:
            yield from response.release()