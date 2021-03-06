export const scraperObject = {
	url: 'http://books.toscrape.com',

	async scraper(browser, category) {
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url} ...`);
		// Navigate to the selected page
		await page.goto(this.url);
		// Select the category of book to be displayed
		let selectedCategory = await page.$$eval(
			'.side_categories > ul > li > ul > li > a',
			(links, _category) => {
				// Search for the element that has the matching text
				links = links.map((a) =>
					a.textContent.replace(
						/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm,
						''
					) === _category
						? a
						: null
				);
				let link = links.filter((tx) => tx !== null)[0];
				return link.href;
			},
			category
		);
		// Navigate to the selected category
		await page.goto(selectedCategory);

		//for storing scrapedData
		let scrapedData = [];

		async function scrapeCurrentPage() {
			// 1st step

			// Wait for the required DOM to be rendered
			await page.waitForSelector('.page_inner');
			// Get the link to all the required books
			let urls = await page.$$eval('section ol > li', (links) => {
				links = links.filter(
					(link) =>
						// Make sure the book to be scraped is in stock
						link.querySelector('.instock.availability > i')
							.textContent !== 'In stock'
				);
				// Extract the links from the data
				links = links.map((el) => el.querySelector('h3 > a').href);
				return links;
			});
			//console.log('Scraped URLS: ', urls);

			//2nd step

			// Loop through each of those links, open a new page instance and get the relevant data from them
			let pagePromise = (link) =>
				new Promise(async (resolve, reject) => {
					let dataObj = {};
					let newPage = await browser.newPage();
					await newPage.goto(link);
					dataObj['bookTitle'] = await newPage.$eval(
						'.product_main > h1',
						(text) => text.textContent
					);
					dataObj['bookPrice'] = await newPage.$eval(
						'.price_color',
						(text) => text.textContent
					);
					dataObj['noAvailable'] = await newPage.$eval(
						'.instock.availability',
						(text) => {
							// Strip new line and tab spaces
							text = text.textContent.replace(
								/(\r\n\t|\n|\r|\t)/gm,
								''
							);
							// Get the number of stock available
							let regexp = /^.*\((.*)\).*$/i;
							let stockAvailable = regexp
								.exec(text)[1]
								.split(' ')[0];
							return stockAvailable;
						}
					);
					dataObj['imageUrl'] = await newPage.$eval(
						'#product_gallery img',
						(img) => img.src
					);
					dataObj['bookDescription'] = await newPage.$eval(
						'#product_description',
						(div) => div.nextSibling.nextSibling.textContent
					);
					dataObj['upc'] = await newPage.$eval(
						'.table.table-striped > tbody > tr > td',
						(table) => table.textContent
					);
					resolve(dataObj);
					await newPage.close();
				});

			for (let link in urls) {
				let currentPageData = await pagePromise(urls[link]);
				//console.log(currentPageData);
				scrapedData.push(currentPageData);
			}
			let nextButtonExist = false;
			try {
				const nextButton = await page.$eval(
					'.next > a',
					(a) => a.textContent
				);
				nextButtonExist = true;
			} catch (error) {
				nextButtonExist = false;
			}
			if (nextButtonExist) {
				await page.click('.next > a');
				return scrapeCurrentPage(); // Call this function recursively
			}
			await page.close();
			return scrapedData;
		}
		let data = await scrapeCurrentPage();
		//console.log(data);
		return data;
	},
};
