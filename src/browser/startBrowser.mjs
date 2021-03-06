import puppeteer from 'puppeteer';

export default async function () {
	let browser;
	try {
		console.log('Opening Browser...');
		browser = await puppeteer.launch({
			headless: false, // set true for production
			args: ['--disable-setuid-sandbox'],
			ignoreHTTPSErrors: true,
		});
	} catch (error) {
		console.log('Could not create a browser instance => : ', error);
	}
	return browser;
}
