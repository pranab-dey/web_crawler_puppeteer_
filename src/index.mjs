import startBrowser from './browser/startBrowser.mjs';
import scraperController from './pageController/pageController.mjs';

let browserInstance = startBrowser(); //creating browser instance
scraperController(browserInstance); // creating a page & navigate to url
