# web_crawler_puppeteer_
#Node.js #puppeteer

This is a demo web crawler for a website (link : http://books.toscrape.com)
I've used puppeteer to scrape all the data.

Functionalities are:
1. setup browser instance
2. scrape all book  Urls from landing page.
3. from that urls, by crawling, gathered all book information individually
4. check for pagnation and automates if pagination exist and gathered data
5. scraped data by single category with pagination
6. scraped data by multiple category with pagination
7. save scraped data in json string on local storage
