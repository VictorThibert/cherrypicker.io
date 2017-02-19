# testing asyncio and aiohttp 
# useful guides: 
#	https://www.blog.pythonlibrary.org/2016/11/09/an-intro-to-aiohttp/
# 	http://www.giantflyingsaucer.com/blog/?p=5557

import asyncio
import async_timeout
import aiohttp

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0'}

@asyncio.coroutine
def fetch_page(session, url):
    print(url[-4:])
    with aiohttp.Timeout(100):
        response = yield from session.get(url, headers=headers)
        try:
            return (yield from response.json())
        finally:
            yield from response.release()

loop = asyncio.get_event_loop()

with aiohttp.ClientSession(loop=loop) as session:

    tasks = [
    fetch_page(session,'http://stats.nba.com/stats/commonplayerinfo/?PlayerID=2544'),
    # fetch_page(session,'http://stats.nba.com/stats/commonplayerinfo/?PlayerID=2545'),
    # fetch_page(session,'http://stats.nba.com/stats/commonplayerinfo/?PlayerID=2546'),
    # fetch_page(session,'http://stats.nba.com/stats/commonplayerinfo/?PlayerID=2547'),
    # fetch_page(session,'http://stats.nba.com/stats/commonplayerinfo/?PlayerID=2548')
    ]

    content = loop.run_until_complete(asyncio.wait(tasks))
    print(content)
    print(content[0])
    
