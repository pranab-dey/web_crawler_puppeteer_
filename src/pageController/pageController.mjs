import { scraperObject } from '../pageScraper/pageScraper.mjs';

import { writeFile } from 'fs';

export default async function (browserInstance) {
	let browser;
	try {
		browser = await browserInstance;

		let scrapedData = {};
		// Call the scraper for different set of books to be scraped (by category)

		scrapedData['Travel'] = await scraperObject.scraper(browser, 'Travel');

		scrapedData['HistoricalFiction'] = await scraperObject.scraper(
			browser,
			'Historical Fiction'
		);

		scrapedData['Mystery'] = await scraperObject.scraper(
			browser,
			'Mystery'
		);

		await browser.close();

		//saving scraped Data as Json string in local storage

		writeFile(
			'scrapedData.json',
			JSON.stringify(scrapedData),
			{
				encoding: 'utf8',
				flag: 'w',
				mode: 0o666,
			},
			(error) => {
				if (error) {
					return console.log('Error on saving data : ', error);
				}
				console.log(
					'Data Has been saved on local machine successfully!'
				);
			}
		);

		//console.log({ scrapedData });
		console.log(scrapedData);
	} catch (error) {
		console.log('Could not resolve the browser instance => ', error);
	}
}
